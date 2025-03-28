export const config = {
  development: {
    apiUrl: 'http://localhost:5000/api/v1'
  },
  production: {
    apiUrl: 'https://api-apsui-electoral.onrender.com/api/v1/'
  }
};

export const getApiUrl = () => {
  const env = import.meta.env.MODE || 'development';
  return config[env].apiUrl;
};
