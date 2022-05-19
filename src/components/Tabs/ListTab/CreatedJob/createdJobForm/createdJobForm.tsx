import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import Spinner from "react-native-loading-spinner-overlay/lib"
import { Title, TouchableRipple } from "react-native-paper"
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackActions } from "@react-navigation/native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { CreatedJobFormTask } from "./createdJobFormTab/createdJobFormTask"
import { CreatedJobFormDetail } from "./createdJobFormTab/createdJobFormDetail"
import { getJobDetailData } from "./createdJobFormProvider"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"

export function CreatedJobForm({route, navigation}) {
    const Tab = createMaterialTopTabNavigator()
    const [ jobCreatedDetail, setJobCreatedDetail] = useState(route.params)


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
                <Title style={{marginStart:20,marginTop:20}}>งานที่สร้าง</Title>
            </View>
            <Tab.Navigator>
                <Tab.Screen initialParams={{jobCreatedDetail: jobCreatedDetail}} name="Detail" component={CreatedJobFormDetail} />
                <Tab.Screen initialParams={{jobCreatedDetail: jobCreatedDetail}} name="Tasks" component={CreatedJobFormTask} />
            </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    }
})