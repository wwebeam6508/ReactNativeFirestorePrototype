
import React from "react"
import ChatTab from "./Tabs/chatTab"
import ListTab from "./Tabs/listTab"
import MapTab from "./Tabs/mapTab"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
const Tab = createBottomTabNavigator()

export default function Main(){

    return(
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Map" component={MapTab} />
                <Tab.Screen name="List" component={ListTab} />
                <Tab.Screen name="Chat" component={ChatTab} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}