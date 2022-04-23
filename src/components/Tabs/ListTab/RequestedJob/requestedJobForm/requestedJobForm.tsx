import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import Spinner from "react-native-loading-spinner-overlay/lib"
import { Title, TouchableRipple } from "react-native-paper"
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackActions } from "@react-navigation/native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { RequestedJobFormTask } from "./requestedJobFormTab/requestedJobFormTask"
import { RequestedJobFormDetail } from "./requestedJobFormTab/requestedJobFormDetail"
import { getJobDetailData } from "./requestedJobFormProvider"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"

export function RequestedJobForm({route, navigation}) {
    const Tab = createMaterialTopTabNavigator()
    const [ jobRequestDetail, setJobRequestDetail] = useState(route.params)
    const [ jobDetail, setJobDetail ] = useState({})



    return(
        <View style={{width:"100%",flex: 1}}>
            <View style={{backgroundColor:"white",flexDirection:'row'}}>
                <TouchableRipple
                    style={{marginLeft:15,marginTop:15,paddingBottom:13,width:55}}
                    onPress={() => navigation.dispatch(StackActions.pop(1))}
                    rippleColor="rgba(0, 0, 0, 1)"
                >
                    <Ionicons style={{textAlign:"center"}} name="arrow-back" size={32} color="black" />
                </TouchableRipple>
                <Title style={{marginStart:20,marginTop:20}}>งานที่ร้องขอ</Title>
            </View>
            <Tab.Navigator>
                <Tab.Screen initialParams={{jobRequestDetail: jobRequestDetail}} name="Detail" component={RequestedJobFormDetail} />
                <Tab.Screen name="Tasks" component={RequestedJobFormTask} />
            </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    }
})