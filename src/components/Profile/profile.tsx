import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Avatar, Text, TextInput, TouchableRipple } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackActions, useNavigation } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import { getUser, updateUserAvatar } from "../../redux/slices/authSlice"
import imagesex from "../../ultis/imagesex"
import {launchImageLibrary} from 'react-native-image-picker'
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import Spinner from "react-native-loading-spinner-overlay/lib"
export default function Profile() {
    const navigation = useNavigation()
    const user_detail:any = useSelector(getUser)
    const dispatch = useDispatch()
    const [spinner, setSpinner] = useState(false)

    const [ formEdit , setFormEdit ] = useState({
        firstname: user_detail.firstname,
        lastname: user_detail.lastname,
        email: user_detail.email,
        birthday: user_detail.birthday,
        country: user_detail.country,
        province: user_detail.province,
        city: user_detail.city,
        detail: user_detail.detail,
        sex: user_detail.sex
    })
    const [ formConditionEdit , setFormConditionEdit ] = useState<any>({})
    
    useEffect(()=>{
        for (const key in formEdit) {
            setFormConditionEdit(prevForm=>({
                ...prevForm,
                [key]: false
            }))
        }
    },[])
    
    async function uploadAvatar() {
        const imageFromLibary = await launchImageLibrary({
            selectionLimit:1,
            mediaType:"photo",
            includeBase64: true
        })
        if(!imageFromLibary.didCancel) {
            setSpinner(true)
            try {
                await dispatch(updateUserAvatar(imageFromLibary.assets[0].base64))
                setSpinner(false)
            } catch (error) {
                setSpinner(false)
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: error,
                })

            }
        }
    }

    return(
        <View style={{width:"100%"}}>
            {
                spinner && 
                <Spinner
                        visible={true}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                />
            }
            <TouchableRipple
                style={{marginLeft:15,marginTop:15,width:55}}
                onPress={() => navigation.dispatch(StackActions.replace('BottomTabScreen'))}
                rippleColor="rgba(0, 0, 0, 1)"
            >
                <Ionicons style={{textAlign:"center"}} name="arrow-back" size={32} color="black" />
            </TouchableRipple>
            <TouchableRipple
                style={styles.content} 
                onPress={() => {uploadAvatar()}}
                rippleColor="rgba(0, 0, 0, 0)"
            >
                <>
                    <Avatar.Image size={155} source={user_detail.avatar ? { uri:user_detail.avatar } : imagesex(user_detail.sex)} />
                    <Ionicons style={{fontWeight:"bold",marginTop:10}} name="camera" size={30} color="black" />
                </>
            </TouchableRipple>
            <View
             style={styles.form}
            >
                {
                    formConditionEdit.firstname ?
                    <View style={styles.inputform}>
                        <TextInput
                            style={styles.input}
                            autoComplete={false}
                            label="Firstname"
                            placeholder="Firstname"
                            value={formEdit.firstname}
                            onChangeText={text => { 
                                setFormEdit(prevForm => ({
                                    ...prevForm,
                                    firstname: text
                                }))
                            }}
                        />
                        <TouchableRipple
                            style={{width:25,marginLeft:20}} 
                            onPress={() => {
                                setFormConditionEdit(prevForm => ({
                                    ...prevForm,
                                    firstname: true
                                }))}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="checkmark" size={35} color="black" />
                        </TouchableRipple>
                    </View>
                    :
                    <View style={styles.inputform}>
                        <Text>ชื่อจริง : {user_detail.firstname}</Text>
                        <TouchableRipple
                            style={{width:25,marginLeft:20}} 
                            onPress={() => {
                                setFormConditionEdit(prevForm => ({
                                    ...prevForm,
                                    firstname: true
                                }))}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="pencil" size={25} color="black" />
                        </TouchableRipple>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    form: {
        alignItems: "center", // ignore this - we'll come back to it
        justifyContent: "center",
        marginTop: 30
    },
    inputform:{             
        
        flexWrap: 'wrap', 
        alignItems: 'flex-start',
        flexDirection:'row'},
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
    },
})