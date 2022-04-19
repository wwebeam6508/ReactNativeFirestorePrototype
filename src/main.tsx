
import React, { useEffect, useState } from "react"
import ChatTab from "./components/Tabs/chatTab"
import ListTab from "./components/Tabs/listTab"
import MapTab from "./components/Tabs/mapTab"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, StackActions  } from "@react-navigation/native"
import SignIn from "./components/Login/signIn"
import firebase from "@react-native-firebase/app"
import { Platform, ScrollView, StyleSheet, View } from "react-native"
import { firebaseConfig } from "./firebaseConfig"
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { getUser, signIn, updateUser } from "./redux/slices/authSlice"
import { Button, Avatar, TouchableRipple, TextInput, Text } from "react-native-paper"
import imagesex from "./ultis/imagesex"
import Setting from "./components/Profile/profile"
import { StatusBar } from "expo-status-bar"
import { useNavigation } from '@react-navigation/native'
import isEmpty from "./ultis/isEmpty"
import DropDown from "react-native-paper-dropdown"
import genderList from "../src/ultis/genderList.json"
import DatePicker from "react-native-date-picker"
import Ionicons from '@expo/vector-icons/Ionicons'
import Spinner from "react-native-loading-spinner-overlay/lib"
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification"
import MapboxGL from "@rnmapbox/maps"
import { REACT_APP_MAP_BOX_GL } from "@env"

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
    MapboxGL.setAccessToken(REACT_APP_MAP_BOX_GL)
    const user_detail:any = useSelector(getUser)
    const dispatch = useDispatch()
    const [initializing, setInitializing] = useState(true)
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [ formInfo, setFormInfo ] = useState<any>({})
    const [ showGenderDropDown, setShowGenderDropDown] = useState(false)
    const [ formConditionbirthday, setFormConditionbirthday] = useState(false)
    const [spinner, setSpinner] = useState(false)
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


    function conditionForSetInfo() {
        if(isEmpty(user_detail.firstname ? user_detail.firstname : "")){
            return true
        } else
        if(isEmpty(user_detail.lastname ? user_detail.lastname : "")){
            return true
        } else
        if(isEmpty(user_detail.birthday ? user_detail.birthday : "")){
            return true
        } else {
            return false
        }
    }

    

    async function updateUserDetail() {
        const userinfo = formInfo
        const errorStackText = []
        if (isEmpty(userinfo.firstname ? userinfo.firstname : "")) {
            errorStackText.push("กรุณากรอกชื่อ")
        }
        if (isEmpty(userinfo.lastname ? userinfo.lastname : "")) {
            errorStackText.push("กรุณากรอกนามสกุล")
        }
        if (isEmpty(userinfo.birthday ? userinfo.birthday : "")){
            errorStackText.push("กรุณาเลือกวันเกิด") 
        }
        if(errorStackText.length > 0) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: errorStackText.toString(),
                button:"Close"
            })
            return
        }
        try {
            setSpinner(true)
            firebase.auth().currentUser.updateProfile({
                displayName: `${formInfo.firstname ? formInfo.firstname : user_detail.firstname} ${formInfo.lastname ? formInfo.lastname : user_detail.lastname}`
            }).then(async ()=>{
                await dispatch(updateUser(userinfo))
                setSpinner(false)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'บันทึกสำเร็จ'
                })
            }).catch((error) =>{
                setSpinner(false)
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: error,
                })
            })
        } catch (error) {
            setSpinner(false)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error,
            })
        }
    }

    return(
        <>
            {
                spinner && 
                <Spinner
                        visible={true}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                />
            }
            {
                isLoggedIn ? 
                <>
                    <StatusBar
                    />
                    {
                        conditionForSetInfo() ? 
                            <View style={{width:"100%",flex: 1}}>
                                <ScrollView>
                                    <View style={styles.form}>
                                        <View style={styles.inputform}>
                                            <TextInput
                                                style={styles.input}
                                                autoComplete={false}
                                                label="Firstname"
                                                placeholder="Firstname"
                                                value={formInfo.firstname}
                                                onChangeText={text => { 
                                                    setFormInfo(prevForm => ({
                                                        ...prevForm,
                                                        firstname: text
                                                    }))
                                                }}
                                            />
                                        </View>
                                        <View style={styles.inputform}>
                                            <TextInput
                                                style={styles.input}
                                                autoComplete={false}
                                                label="Lastname"
                                                placeholder="Lastname"
                                                value={formInfo.lastname}
                                                onChangeText={text => { 
                                                    setFormInfo(prevForm => ({
                                                        ...prevForm,
                                                        lastname: text
                                                    }))
                                                }}
                                            />
                                        </View>
                                        <View style={styles.inputform}>
                                            <DropDown
                                                label={"Gender"}
                                                mode={"outlined"}
                                                visible={showGenderDropDown}
                                                showDropDown={() => setShowGenderDropDown(true)}
                                                onDismiss={() => setShowGenderDropDown(false)}
                                                value={formInfo.sex}
                                                setValue={(value)=>{
                                                    setFormInfo(prevForm=>({
                                                        ...prevForm,
                                                        sex: value
                                                    }))}}
                                                list={genderList}
                                            />      
                                        </View>
                                        <View style={styles.inputform}>
                                            {
                                                formInfo.birthday ? 
                                                <Text style={{marginTop:10}}>วัน-เดือน-ปี เกิด: {formInfo.birthday}</Text>
                                                :
                                                <Text style={{marginTop:10}}> กรุณาเลือกวัน-เดือน-ปี เกิด</Text>
                                            }
                                            <TouchableRipple
                                                style={{width:25,marginLeft:20}} 
                                                onPress={() => {
                                                    setFormConditionbirthday(true)}}
                                                rippleColor="rgba(0, 0, 0, 0)"
                                            >
                                                <Ionicons style={{fontWeight:"bold"}} name="pencil" size={25} color="black" />
                                            </TouchableRipple>
                                            <DatePicker
                                                modal
                                                mode="date"
                                                open={formConditionbirthday}
                                                date={new Date(formInfo.birthday ? formInfo.birthday : null)}
                                                onConfirm={async (date) => {
                                                    setFormInfo(prevForm=>({
                                                        ...prevForm,
                                                        birthday: moment(date).format('YYYY-MM-DD')
                                                    }))
                                                    setFormConditionbirthday(false)
                                                }}
                                                onCancel={() => {
                                                    setFormConditionbirthday(false)
                                                }}
                                            />
                                        </View>
                                        <View style={styles.inputform}>
                                            <Button
                                                onPress={()=>{updateUserDetail()}}
                                                mode="contained"
                                                style={{marginTop: 20, marginBottom: 20}}
                                                contentStyle={{
                                                    backgroundColor: "blue",
                                                    height: 50,
                                                    width: 300
                                                }}
                                            >
                                                Save
                                            </Button> 
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        :
                        <NavigationContainer>
                            <Stack.Navigator 
                                initialRouteName="BottomTabScreen"
                            >
                                <Stack.Screen options={{ headerShown: false }} name="BottomTabScreen" component={BottomTabScreen} />
                                <Stack.Screen options={{ headerShown: false }} name="Setting" component={Setting} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    }
                </>
                :
                    <SignIn/>
            }
        </>
        
    )
}

const styles = StyleSheet.create({
    form: {
        alignItems: "center", // ignore this - we'll come back to it
        justifyContent: "center",
        marginTop: 30
    },
    inputform:{  
        marginTop: 5,           
        flexWrap: 'wrap', 
        alignItems: 'flex-start',
        flexDirection:'row'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    content: {
        marginTop: 20,
        borderRadius: 100,
        alignItems: "center", // ignore this - we'll come back to it
        justifyContent: "center"
    },
    input: {
        textAlign: "center",
        width: 290,
        height: 44,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    }
})

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