
import React from "react"
import ChatTab from "./components/Tabs/chatTab"
import ListTab from "./components/Tabs/listTab"
import MapTab from "./components/Tabs/mapTab"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import SignIn from "./components/Login/signIn"
import firebase from "@react-native-firebase/app"
import { Platform } from "react-native"
import { firebaseConfig } from "./firebaseConfig"

const Tab = createBottomTabNavigator()

const credentials = Platform.select({
    android: firebaseConfig,
    ios: firebaseConfig,
})

const config = {
    name: 'Connectionerror_APP',
}

if (!firebase.apps.length) {
    firebase.initializeApp(credentials, config)
}


export default function Main(){

    return(
        <>
            <SignIn/>
        </>
        // <NavigationContainer>
        //     <Tab.Navigator>
        //         <Tab.Screen name="Map" component={MapTab} />
        //         <Tab.Screen name="List" component={ListTab} />
        //         <Tab.Screen name="Chat" component={ChatTab} />
        //     </Tab.Navigator>
        // </NavigationContainer>
    )
}