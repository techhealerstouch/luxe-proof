// lib/api-login.ts

// PKCE Helpers
function base64UrlEncode(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

export async function initiateOAuthLogin() {
  const clientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("pkce_code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `${
    process.env.NEXT_PUBLIC_API_URL
  }/oauth/authorize?${params.toString()}`;

  window.location.href = authUrl;
}
