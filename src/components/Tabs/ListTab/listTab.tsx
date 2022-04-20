import React from "react"
import { Text, View } from "react-native"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { CreatedJob } from "./CreatedJob/createdJob"
import { RequestedJob } from "./RequestedJob/requestedJob"
const Tab = createMaterialTopTabNavigator()
export default function ListTab(){

    return(
        <Tab.Navigator>
            <Tab.Screen name="Requested" component={RequestedJob} />
            <Tab.Screen name="Created" component={CreatedJob} />
        </Tab.Navigator>
    )
}