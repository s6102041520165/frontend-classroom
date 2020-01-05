export const storeToken = (token = null) => ({
  type: "STORE_TOKEN",
  token
});

export const storeGoogleId = (googleId = null) => ({
  type: "STORE_GOOGLE_ID",
  googleId
});

