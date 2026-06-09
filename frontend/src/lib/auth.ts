const TOKEN_KEY = 'sifa_admin_token';

function decodePayload(token: string) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized)) as { role?: 'ADMIN' | 'STAFF'; email?: string };
  } catch {
    return null;
  }
}

export const authStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getRole: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? decodePayload(token)?.role : null;
  },
  clear: () => localStorage.removeItem(TOKEN_KEY)
};
