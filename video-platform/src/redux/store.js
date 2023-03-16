import { configureStore,combineReducers} from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from 'redux-persist'
import userReducer from './userSlice'
import videoReducer from './videoSlice'
import storage from 'redux-persist/lib/storage'

const persistConfig={
  key:'video-platform',
  version:1,
  storage,
}

// const rootReducer=combineReducers({user:userReducer,video:videoReducer});
const appReducer=combineReducers({user:userReducer,video:videoReducer});
const rootReducer=(state,action)=>{
  
  if(action.type==='user/logout') {
    // storage.clear();
    state=undefined;
    // storage.removeItem('persist:root');
  }
  return appReducer(state,action);
};
const persistedReducer= persistReducer(persistConfig,rootReducer);
export const store= configureStore({
  // reducer: {
  //   user:userReducer,
  //   video:videoReducer
  // }
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>
   getDefaultMiddleware({
    serializableCheck:{
      ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
    },
   })
  
})

export const persistor = persistStore(store)