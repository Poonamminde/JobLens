const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

export default function OAuthButtons() {
  const startGoogleOAuth = () => {
    if (!apiUrl) return;
    window.location.assign(`${apiUrl}/auth/oauth/google`);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <button
        type="button"
        onClick={startGoogleOAuth}
        disabled={!apiUrl}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#dadce0] bg-white px-4 py-3 text-sm font-semibold text-[#3c4043] shadow-sm transition duration-150 hover:border-[#c6c9ce] hover:bg-[#f8faff] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M48 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h13.47c-.58 2.96-2.24 5.48-4.7 7.18l7.56 5.87C44.74 37.76 48 31.7 48 24.55Z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.56-5.87c-2.1 1.41-4.79 2.25-8.34 2.25-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
          <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}