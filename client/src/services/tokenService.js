const TOKEN_EXPIRY_HOURS = 48;

export const setToken = (token) => {
    const expiryTime = Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", expiryTime);
};

export const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
};

export const getToken = () => {
    const token = localStorage.getItem("token");
    const expiryTime = localStorage.getItem("tokenExpiry");

    if (!token || !expiryTime) return null;

    if (Date.now() > parseInt(expiryTime)) {
        clearToken();
        return null;
    }

    return token;
};

export const isTokenExpired = () => {
  const expiryTime = localStorage.getItem('tokenExpiry');
  return !expiryTime || Date.now() > parseInt(expiryTime);
};