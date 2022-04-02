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
    async (file, store) =>{
        return await uploadImage(file, store.getState().auth.user.uid)
    }
)

export const updateUser = createAsyncThunk('updateUser',
    async (userdetail, store) =>{
        const batch = firestore().batch()
        const userRef = firestore().collection('users').doc(store.getState().auth.user.uid)
        const userinfo = userdetail
        batch.update(userRef, userinfo)
        await batch.commit()
        return userinfo
    }
)

const authSlice = createSlice({ 
    name: 'auth',
    initialState,
    reducers:{
        signIn: (state, action) =>{
            state.user = action.payload
        },
        signOutApp: (state) => {
            state.user = initialState
        }
    },
    extraReducers:{
        [updateUserAvatar.fulfilled]: (state, action)=>{
            state.user = Object.assign(state.user , action.payload)
        },
        [updateUser.fulfilled]: (state, action)=>{
            state.user = Object.assign(state.user , action.payload)
        }
    }
})

function uploadImage(file, uid){
    return new Promise((resolve)=>{
        const storageRef = storage().ref(`usersAvatar/${uid}`)
        storageRef.putString(file, 'data_url').then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
                const batch = firestore().batch()
                const userRef = firestore().collection('users').doc(uid)
                const avatar = {avatar: downloadURL}
                batch.update(userRef, avatar)
                batch.commit()
                resolve(avatar)
            })
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