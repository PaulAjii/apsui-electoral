export const config = {
  development: {
    // apiUrl: 'http://localhost:5000/api/v1'
    apiUrl: 'https://effective-carnival-rv7r566rg6x2p6pg-5000.app.github.dev/api/v1/'
  },
  production: {
    apiUrl: 'https://api-apsui-electoral.vercel.app/api/v1/'
  }
};

export const getApiUrl = () => {
  const env = import.meta.env.MODE || 'development';
  return config[env].apiUrl;
};
