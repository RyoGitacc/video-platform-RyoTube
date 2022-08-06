import { createSlice } from '@reduxjs/toolkit'

const initialState={
    videoComments:[],
    loading:false,
    error:false
}

export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
      fetchCommentsStart:(state)=>{
        state.loading=true
      },
      fetchCommentsSuccess:(state,action)=>{
        state.loading=false;
        state.videoComments = action.payload
      },
      fetchCommnetsFailure:(state)=>{
        state.loading=false;
        state.error=true;
      },
      addComment:(state,action)=>{
        state.videoComments.unshift(action.payload);
      }
    }
  });

  export const {fetchCommentsStart,fetchCommentsSuccess,fetchCommnetsFailure,addComment} = commentSlice.actions;
  export default commentSlice.reducer;