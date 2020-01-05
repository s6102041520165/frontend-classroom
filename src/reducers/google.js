export const token =  (state = null, action) => {
  switch (action.type) {
    case "STORE_TOKEN":
      return action.token;
    case "CLEAR_TOKEN":
      return null;
  
    default:
      return state;
  }
}


export const googleId = (state = null, action) => {
  switch (action.type) {
    case "STORE_GOOGLE_ID":
      return action.googleId;
    case "CLEAR_GOOGLE_ID":
      return null;
  
    default:
      return state;
  }
}
