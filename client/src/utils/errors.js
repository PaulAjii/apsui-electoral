export const errorHandler = (err) => {
  if (err.response) {
    const message = err.response.data.message || err.response.statusText;
    throw new Error(message);
  } else if (err.request) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error(err.message || 'An unexpected error occurred');
  }
};
