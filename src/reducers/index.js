import { combineReducers } from "redux";
import { token, googleId, permissions } from "./google";

export default combineReducers({
  token,
  googleId,
  permissions
});
