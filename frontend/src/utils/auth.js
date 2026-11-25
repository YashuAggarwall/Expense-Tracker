// Authentication helpers to manage tokens and user info consistently across storage

export const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

export const getAuthUser = () => {
  return {
    token: getAuthToken(),
    username: sessionStorage.getItem('username') || localStorage.getItem('username') || '',
    id: sessionStorage.getItem('id') || localStorage.getItem('id') || '',
  };
};

export const setAuthData = (token, username, id) => {
  if (token) {
    sessionStorage.setItem('token', token);
    localStorage.setItem('token', token);
  }
  if (username) {
    sessionStorage.setItem('username', username);
    localStorage.setItem('username', username);
  }
  if (id) {
    sessionStorage.setItem('id', id);
    localStorage.setItem('id', id);
  }
};

export const clearAuthData = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('inviteCode');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('id');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
