

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isGeoActive: false
}





const userSlice = createSlice({ 
    name: 'user',
    initialState,
    reducers:{
        changeGeoActive: (state:any, action) =>{
            state.isGeoActive = action.payload
        }
    },
    extraReducers:{
    }
})
export const {changeGeoActive} = userSlice.actions
export const getApplication = (state) => {
    return state.user
}

export default userSlice.reducer