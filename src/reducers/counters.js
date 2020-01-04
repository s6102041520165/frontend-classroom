export default (state = null, action) => {
  switch (action.type) {
    case "STORE_TOKEN":
      return action.token;
    case "CLEAR_TOKEN":
      return null;
  
    default:
      return state;
  }
}
