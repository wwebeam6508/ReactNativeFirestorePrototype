import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Avatar, Text, TextInput, TouchableRipple } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackActions, useNavigation } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import { getUser, updateUser, updateUserAvatar } from "../../redux/slices/authSlice"
import imagesex from "../../ultis/imagesex"
import {launchImageLibrary} from 'react-native-image-picker'
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import Spinner from "react-native-loading-spinner-overlay/lib"
import DropDown from "react-native-paper-dropdown"

export default function Profile() {
    const navigation = useNavigation()
    const user_detail:any = useSelector(getUser)
    const dispatch = useDispatch()
    const [spinner, setSpinner] = useState(false)

    const [ formEdit , setFormEdit ] = useState<any>({})
    const [ formConditionEdit , setFormConditionEdit ] = useState<any>({})
    const [ showGenderDropDown, setShowGenderDropDown] = useState(false)
    const genderList = [
        {
          label: "Male",
          value: "male",
        },
        {
          label: "Female",
          value: "female",
        },
        {
          label: "Others",
          value: "others",
        },
    ]
    
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

    function enableEditField(key) {
        for (const key in formEdit) {
            setFormConditionEdit(prevForm=>({
                ...prevForm,
                [key]: false
            }))
        }
        setFormConditionEdit(prevForm => ({
            ...prevForm,
            [key]: true
        }))
        setFormEdit(prevForm=>({
            ...prevForm,
            [key]: user_detail[key]
        }))
    }

    async function updateUserDetail(fieldEdit, key) {
        const userinfo = {
            [key] : fieldEdit
        }
        try {
            setSpinner(true)
            await dispatch(updateUser(userinfo))
            setFormConditionEdit(prevForm => ({
                ...prevForm,
                [key]: false
            }))
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
                        <TouchableRipple
                            style={{width:25,marginRight:20}} 
                            onPress={() => {
                                setFormConditionEdit(prevForm=>({
                                    ...prevForm,
                                    firstname: false
                                }))}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="close" size={30} color="black" />
                        </TouchableRipple>
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
                            style={{width:25,marginLeft:15}} 
                            onPress={async () => {await updateUserDetail(formEdit.firstname, 'firstname')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="checkmark" size={30} color="black" />
                        </TouchableRipple>
                    </View>
                    :
                    <View style={styles.inputform}>
                        <TextInput
                            style={styles.input}
                            autoComplete={false}
                            label="Firstname"
                            placeholder="Firstname"
                            value={user_detail.firstname}
                            onChangeText={() => {}}
                            disabled={true}
                        />
                        <TouchableRipple
                            style={{width:25,marginLeft:20}} 
                            onPress={() => {enableEditField('firstname')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="pencil" size={25} color="black" />
                        </TouchableRipple>
                    </View>
                }
                {
                    formConditionEdit.lastname ?
                    <View style={styles.inputform}>
                        <TouchableRipple
                            style={{width:25,marginRight:20}} 
                            onPress={() => {
                                setFormConditionEdit(prevForm=>({
                                    ...prevForm,
                                    lastname: false
                                }))}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="close" size={30} color="black" />
                        </TouchableRipple>
                        <TextInput
                            style={styles.input}
                            autoComplete={false}
                            label="Lastname"
                            placeholder="lastname"
                            value={formEdit.lastname}
                            onChangeText={text => { 
                                setFormEdit(prevForm => ({
                                    ...prevForm,
                                    lastname: text
                                }))
                            }}
                        />
                        <TouchableRipple
                            style={{width:25,marginLeft:15}} 
                            onPress={async () => {await updateUserDetail(formEdit.lastname, 'lastname')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="checkmark" size={30} color="black" />
                        </TouchableRipple>
                    </View>
                    :
                    <View style={styles.inputform}>
                        <TextInput
                            style={styles.input}
                            autoComplete={false}
                            label="Lastname"
                            placeholder="lastname"
                            value={user_detail.lastname}
                            onChangeText={() => {}}
                            disabled={true}
                        />
                        <TouchableRipple
                            style={{width:25,marginLeft:20}} 
                            onPress={() => {enableEditField('lastname')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="pencil" size={25} color="black" />
                        </TouchableRipple>
                    </View>
                }
                {
                    formConditionEdit.sex ?
                    <View style={styles.inputform}>
                        <TouchableRipple
                            style={{width:25,marginRight:20}} 
                            onPress={() => {
                                setFormConditionEdit(prevForm=>({
                                    ...prevForm,
                                    sex: false
                                }))}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="close" size={30} color="black" />
                        </TouchableRipple>
                        <DropDown
                        label={"Gender"}
                        mode={"outlined"}
                        visible={showGenderDropDown}
                        showDropDown={() => setShowGenderDropDown(true)}
                        onDismiss={() => setShowGenderDropDown(false)}
                        value={formEdit.sex}
                        setValue={(value)=>{
                            setFormEdit(prevForm=>({
                                ...prevForm,
                                sex: value
                            }))}}
                        list={genderList}
                        />       
                        <TouchableRipple
                            style={{width:25,marginLeft:15}} 
                            onPress={async () => {await updateUserDetail(formEdit.sex, 'sex')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="checkmark" size={30} color="black" />
                        </TouchableRipple>
                    </View>
                    :
                    <View style={styles.inputform}>
                        
                        <TextInput
                            style={styles.input}
                            autoComplete={false}
                            label="Gender"
                            placeholder="gender"
                            value={user_detail.sex}
                            onChangeText={() => {}}
                            disabled={true}
                        />
                        <TouchableRipple
                            style={{width:25,marginLeft:20}} 
                            onPress={() => {enableEditField('sex')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="pencil" size={25} color="black" />
                        </TouchableRipple>
                    </View>
                }
                {
                    formConditionEdit.email ?
                    <View style={styles.inputform}>
                        <TouchableRipple
                            style={{width:25,marginRight:20}} 
                            onPress={() => {
                                setFormConditionEdit(prevForm=>({
                                    ...prevForm,
                                    email: false
                                }))}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="close" size={30} color="black" />
                        </TouchableRipple>
                        <TextInput
                            style={styles.input}
                            autoComplete={false}
                            label="Email"
                            placeholder="email"
                            value={formEdit.email}
                            onChangeText={text => { 
                                setFormEdit(prevForm => ({
                                    ...prevForm,
                                    email: text
                                }))
                            }}
                        /> 
                        <TouchableRipple
                            style={{width:25,marginLeft:15}} 
                            onPress={async () => {await updateUserDetail(formEdit.email, 'email')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="checkmark" size={30} color="black" />
                        </TouchableRipple>
                    </View>
                    :
                    <View style={styles.inputform}>
                        
                        <TextInput
                            style={styles.input}
                            autoComplete={false}
                            label="Email"
                            placeholder="email"
                            value={user_detail.email}
                            onChangeText={() => {}}
                            disabled={true}
                        />
                        <TouchableRipple
                            style={{width:25,marginLeft:20}} 
                            onPress={() => {enableEditField('email')}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold"}} name="pencil" size={25} color="black" />
                        </TouchableRipple>
                    </View>
                }
                {
                    <View style={styles.inputform}>
                        <Text>Email Verified :  {user_detail.emailVerified ? 
                            <Ionicons style={{fontWeight:"bold"}} name="checkmark-circle" size={15} color="green" />
                            : 
                            <Ionicons style={{fontWeight:"bold"}} name="close-circle" size={15} color="red" />}
                        </Text>
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
        marginTop: 5,           
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
    }
})