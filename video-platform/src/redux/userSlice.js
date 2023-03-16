import { createSlice } from '@reduxjs/toolkit'

const initialState={
    currentUser:null,
    loading:false,
    error:false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      loginStart:(state)=>{
        state.loading=true
      },
      loginSuccess:(state,action)=>{
        state.loading=false;
        state.currentUser=action.payload
      },
      loginFailure:(state)=>{
        state.loading=false;
        state.error=true;
      },
      logout:(state)=>{
        state = initialState;
      },
      subscription:(state,action)=>{
        if(state.currentUser.subscribedUsers.includes(action.payload)){
          state.currentUser.subscribedUsers.splice(
            state.currentUser.subscribedUsers.findIndex(channelId=>
              channelId === action.payload),1
          )
        }else{
          state.currentUser.subscribedUsers.push(action.payload)
        }
      },
      addSuggest:(state,action)=>{
        if(state.currentUser.suggest.includes(action.payload)){
         const newSuggest = state.currentUser.suggest.filter((s)=>s !== action.payload);
         newSuggest.unshift(action.payload)
         state.currentUser.suggest = newSuggest;
        }else{
          state.currentUser.suggest.unshift(action.payload)
        }
         if(state.currentUser.suggest.length > 10) 
            state.currentUser.suggest.pop();
      },
      update:(state,action)=>{
       state.currentUser=action.payload;
      }
    }
  });

  export const {loginStart,loginSuccess,loginFailure,logout,subscription,addSuggest,update} = userSlice.actions;
  export default userSlice.reducer;