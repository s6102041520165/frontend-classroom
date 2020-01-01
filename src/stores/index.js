import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers";

const persistConfig = {
  key: "root",
  storage
};

//Configure persist (localStorage and reducer)
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  //Created store
  let store = createStore(persistedReducer);
  let persistor = persistStore(store);
  return { store, persistor };
};
