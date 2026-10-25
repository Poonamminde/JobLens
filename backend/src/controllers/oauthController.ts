import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
}

const isProd = process.env['NODE_ENV'] === 'production';
const clientUrl = () => process.env['CLIENT_URL'] ?? 'http://localhost:5173';
const backendUrl = () => process.env['BACKEND_URL'] ?? 'http://localhost:5000';
const stateCookieName = 'oauth_google_state';

const redirectWithError = (res: Response, message: string): void => {
  const destination = new URL('/login', clientUrl());
  destination.searchParams.set('oauth_error', message);
  res.redirect(destination.toString());
};

const callbackUrl = () => `${backendUrl()}/api/auth/oauth/google/callback`;

const beginGoogleOAuth = (res: Response): void => {
  const state = randomBytes(32).toString('hex');
  res.cookie(stateCookieName, state, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
    path: '/api/auth/oauth',
  });

  const authorizeUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  authorizeUrl.search = new URLSearchParams({
    client_id: process.env['GOOGLE_CLIENT_ID'] ?? '',
    redirect_uri: callbackUrl(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  }).toString();

  res.redirect(authorizeUrl.toString());
};

const validateGoogleState = (req: Request, res: Response): boolean => {
  const cookieState = req.cookies?.[stateCookieName] as string | undefined;
  const queryState = req.query['state'];
  res.clearCookie(stateCookieName, { path: '/api/auth/oauth' });

  if (typeof queryState !== 'string' || !cookieState) return false;
  const cookieBuffer = Buffer.from(cookieState);
  const queryBuffer = Buffer.from(queryState);
  return cookieBuffer.length === queryBuffer.length && timingSafeEqual(cookieBuffer, queryBuffer);
};

const createOrFindGoogleUser = async (profile: GoogleProfile) => {
  if (!profile.email || !profile.email_verified) {
    throw new Error('Google did not return a verified email address');
  }

  const email = profile.email.toLowerCase();
  const byProvider = await User.findOne({ googleId: profile.sub });
  if (byProvider) return byProvider;

  const byEmail = await User.findOne({ email }).select('+password');
  if (byEmail) {
    if (byEmail.googleId && byEmail.googleId !== profile.sub) {
      throw new Error('This email is connected to a different Google account');
    }
    byEmail.googleId = profile.sub;
    await byEmail.save();
    return byEmail;
  }

  return User.create({ name: profile.name, email, googleId: profile.sub });
};

export const startGoogleOAuth = (_req: Request, res: Response): void => {
  if (!process.env['GOOGLE_CLIENT_ID'] || !process.env['GOOGLE_CLIENT_SECRET']) {
    redirectWithError(res, 'Google sign-in is not configured');
    return;
  }
  beginGoogleOAuth(res);
};

export const completeGoogleOAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validateGoogleState(req, res)) {
      redirectWithError(res, 'Google sign-in could not be verified. Please try again.');
      return;
    }
    if (typeof req.query['error'] === 'string') {
      redirectWithError(res, 'Google sign-in was canceled');
      return;
    }

    const code = req.query['code'];
    if (typeof code !== 'string') throw new Error('Google sign-in did not return an authorization code');

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env['GOOGLE_CLIENT_ID'] ?? '',
        client_secret: process.env['GOOGLE_CLIENT_SECRET'] ?? '',
        redirect_uri: callbackUrl(),
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenResponse.ok || !tokenData.access_token) throw new Error('Google token exchange failed');

    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json() as GoogleProfile;
    if (!profileResponse.ok) throw new Error('Could not retrieve Google profile');

    const user = await createOrFindGoogleUser(profile);
    generateToken(res, user._id);
    res.redirect(new URL('/dashboard', clientUrl()).toString());
  } catch (error) {
    redirectWithError(res, error instanceof Error ? error.message : 'Google sign-in failed');
  }
};