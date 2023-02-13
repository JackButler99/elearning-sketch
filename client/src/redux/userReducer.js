import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  currentUser: null,
  loading: false,
  error: false
}


export const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    registerStart: (state)=> {
      state.loading = true
    },
    registerSuccess: (state)=> {
      state.loading = false
    },
    registerFailure: (state)=>{
      state.loading = false
      state.error = true
    },

    loginStart: (state)=> {
      state.loading = true
    }, 
    loginSuccess: (state, action)=>{
      state.loading = false
      state.currentUser = action.payload
    },
    loginFailure: (state)=>{
      state.loading = false
      state.error = true
    },
    logout:(state)=> {
      state.currentUser=null
      state.loading = false
      state.error=false
    },
    subscription: (state, action)=> {
      if (state.currentUser.subscibedUsers.includes(action.payload)){
        state.currentUser.subscibedUsers.splice(
          state.currentUser.subscibedUsers.findIndex(
            (channelId) => channelId === action.payload
          ), 1
        )
      } else {
        state.currentUser.subscibedUsers.push(action.payload)
      }
    }
  }
})

export const {registerStart, registerSuccess, registerFailure, loginStart, loginSuccess, loginFailure, logout, subscription} = userSlice.actions

export default userSlice.reducer