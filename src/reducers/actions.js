export const storeToken = (token = null) => ({
  type: "STORE_TOKEN",
  token
});

export const clearToken = (token = null) => ({
  type: "CLEAR_TOKEN",
  token
});

