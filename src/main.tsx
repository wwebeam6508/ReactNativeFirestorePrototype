
import React, { useEffect, useState } from "react"
import ChatTab from "./components/Tabs/chatTab"
import ListTab from "./components/Tabs/listTab"
import MapTab from "./components/Tabs/mapTab"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, StackActions  } from "@react-navigation/native"
import SignIn from "./components/Login/signIn"
import firebase from "@react-native-firebase/app"
import { Platform } from "react-native"
import { firebaseConfig } from "./firebaseConfig"
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { getUser, signIn } from "./redux/slices/authSlice"
import { Button, Avatar, TouchableRipple } from "react-native-paper"
import imagesex from "./ultis/imagesex"
import Setting from "./components/Profile/profile"
import { StatusBar } from "expo-status-bar"
import { useNavigation } from '@react-navigation/native'
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const credentials = Platform.select({
    android: firebaseConfig,
    ios: firebaseConfig,
})

const config = {
    name: 'Connectionerror_APP',
}


export default function Main(){
    
    const dispatch = useDispatch()
    const [initializing, setInitializing] = useState(true)
    const [isLoggedIn, setisLoggedIn] = useState(false)
    useEffect(() => {
        async function init() {
            if (!firebase.apps.length) {
                await firebase.initializeApp(credentials , config)
             }
             const subscriber = auth().onAuthStateChanged(await onAuthStateChanged)
             return subscriber // unsubscribe on unmount
        }
        init()
    }, [])

    async function onAuthStateChanged(user) {
        if (user) {
            const user_doc = await firestore().collection('users').doc(user.uid).get()
            const user_data = user_doc.data()
            let user_detail = user_data
            user_detail.dateJoined = moment( new Date(user_detail.dateJoined.seconds*1000)).format('DD/MM/YYYY hh:mm:ss')
            user_detail = Object.assign(user_detail, {birthday:user_data.birthday ? user_data.birthday : Date.parse(user_data.birthday) || 0})
            user_detail = Object.assign(user_detail, {
                accessToken:user.accessToken,
                emailVerified:user.emailVerified,
                uid:user.uid,
            })
            dispatch(signIn(user_detail))
            setisLoggedIn(true)
        } else {
            setisLoggedIn(false)
        }
        if (initializing) setInitializing(false)
    }
    
    if (initializing) return null


    return(
        <>
            {
                isLoggedIn ? 
                <>
                    <StatusBar
                    />
                    <NavigationContainer>
                        <Stack.Navigator 
                            initialRouteName="BottomTabScreen"
                        >
                            <Stack.Screen options={{ headerShown: false }} name="BottomTabScreen" component={BottomTabScreen} />
                            <Stack.Screen options={{ headerShown: false }} name="Setting" component={Setting} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </>
                :
                    <SignIn/>
            }
        </>
        
    )
}

function BottomTabScreen() {
    const navigation = useNavigation()
    const user_detail:any = useSelector(getUser)
    const headerBar = {
        title: "",
        headerLeft: ()=> (
            <TouchableRipple
                style={{marginLeft:15,marginBottom:25}}
                onPress={() => navigation.dispatch(StackActions.replace('Setting'))}
                rippleColor="rgba(0, 0, 0, 1)"
            >
                <Avatar.Image size={46} source={user_detail.avatar ? { uri:user_detail.avatar } : imagesex(user_detail.sex)} />
            </TouchableRipple>
        ),
        headerRight: ()=> <Button mode="contained">Notfication</Button>
    }
    return(
        <Tab.Navigator
            screenOptions={headerBar}
        >
            <Tab.Screen 
                name="Map" component={MapTab} />
            <Tab.Screen 
                name="List" component={ListTab} />
            <Tab.Screen 
                name="Chat" component={ChatTab} />
        </Tab.Navigator>
    )
}