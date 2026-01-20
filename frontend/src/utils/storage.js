const ACCESS_TOKEN_KEY = 'accessToken';

export const storage = {
  setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  clear() {
    localStorage.clear();
  }
};