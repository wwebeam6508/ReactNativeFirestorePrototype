
import React from "react"
import ChatTab from "./components/Tabs/chatTab"
import ListTab from "./components/Tabs/listTab"
import MapTab from "./components/Tabs/mapTab"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import SignIn from "./components/Login/signIn"
const Tab = createBottomTabNavigator()

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