import firestore from '@react-native-firebase/firestore'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import storage from '@react-native-firebase/storage'
const initialState = {
    accessToken:"",
    avatar:"",
    firstname:"",
    lastname:"",
    email:"",
    emailVerified:"",
    phoneNumber:"",
    birthday:"",
    country:"",
    province:"",
    city:"",
    uid:"",
    detail:"",
    sex:"",
    dateJoined:""
}

export const updateUserAvatar = createAsyncThunk('updateUserAvatar',
    async (file:any, store:any) =>{
        return await uploadImage(file, store.getState().auth.user.uid)
    }
)

export const updateUser = createAsyncThunk('updateUser',
    async (userdetail:Object, store:any) =>{
        const batch = firestore().batch()
        const userRef = firestore().collection('users').doc(store.getState().auth.user.uid)
        const userinfo = userdetail
        batch.update(userRef, userdetail)
        await batch.commit()
        return userinfo
    }
)

const authSlice = createSlice({ 
    name: 'auth',
    initialState,
    reducers:{
        signIn: (state:any, action) =>{
            state.user = action.payload
        },
        signOutApp: (state:any) => {
            state.user = initialState
        }
    },
    extraReducers:{
        [updateUserAvatar.fulfilled.toString()]: (state:any, action)=>{
            state.user = Object.assign(state.user , action.payload)
        },
        [updateUser.fulfilled.toString()]: (state:any, action)=>{
            state.user = Object.assign(state.user , action.payload)
        }
    }
})

function uploadImage(file, uid){
    return new Promise((resolve)=>{
        const storageRef = storage().ref(`usersAvatar/${uid}`)
        storageRef.putString(file, storage.StringFormat.BASE64).then(async () => {
            const downloadURL = await storage().ref(`usersAvatar/${uid}`).getDownloadURL()
            const batch = firestore().batch()
            const userRef = firestore().collection('users').doc(uid)
            const avatar = {avatar: downloadURL}
            batch.update(userRef, avatar)
            batch.commit() 
            resolve(avatar)
        })  
    })
}

export const {signIn , signOutApp} = authSlice.actions

export const getUser = (state) => {
    let user = {}
    for (const key in state.auth.user) {
        if(state.auth.user[key] === null) {
            Object.assign(user, {[`${key}`]: ""})
        } else {
            Object.assign(user, {[`${key}`]: state.auth.user[key]})
        }
    }
    return user
}

export default authSlice.reducer