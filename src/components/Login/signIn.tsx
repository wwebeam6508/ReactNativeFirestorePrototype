import React, { useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import firestore from '@react-native-firebase/firestore'
import { Button, TextInput } from "react-native-paper"
import PhoneInput from "react-native-phone-number-input"
import Recaptcha, { RecaptchaHandles } from "react-native-recaptcha-that-works"
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import auth from '@react-native-firebase/auth'
import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import Spinner from 'react-native-loading-spinner-overlay'
import { useDispatch } from "react-redux"
import { signIn } from "../../redux/slices/authSlice"

export default function SignIn() {

    const dispatch = useDispatch()

    const phoneInput = useRef<PhoneInput>(null)
    const [valuePhone, setValuePhone] = useState("")
    const [formattedValue, setFormattedValue] = useState("")
    const [inputOtp, setInputOTP] = useState("")
    const [isSendOTP, setisSendOTP] = useState(false)
    const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult>()
    const recaptcha = useRef<RecaptchaHandles>(null)

    const [spinner, setSpinner] = useState(false)

    const send = () => {
        if(phoneValidation()){
            recaptcha.current?.open()
        } else {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Requirement have not been met',
                textBody: 'กรุณากรอกเบอร์โทรให้ถูกต้อง',
            })
        }
    }

    async function onVerify() {
        setSpinner(true)
        auth().signInWithPhoneNumber(formattedValue)
        .catch((error:any) => {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error,
            })
            setSpinner(false)
        })
        .then((result:any)=>{
            setConfirm(result)
            setSpinner(false)
        })
    }

    const onExpire = () => {
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Expire',
            textBody: 'Token has been Expire',
        })
    }

    const onError = () => {
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: 'There have something wrong',
        })
    }

    function phoneValidation () {
        if(valuePhone.trim().length === 0){
            return false
        } else {
            return true
        } 
    }

    async function confirmOTPCode() {
        if(inputOtp.trim().length > 0){
            try {
                if(confirm){
                    setSpinner(true)
                    await confirm.confirm(inputOtp).then(async (result:any)=>{
                        await onSignInSubmit(result.user)
                    }).catch((error)=>{
                        setSpinner(false)
                        Dialog.show({
                            type: ALERT_TYPE.DANGER,
                            title: 'Error',
                            textBody: error,
                        })
                    })
                }
            } catch (error) {
                setSpinner(false)
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: 'รหัส OTP ไม่ถูกต้อง',
                })
            }
        } else {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Requirement have not been met',
                textBody: 'กรุณากรอกรหัส OTP',
            })
        }
    }

    async function onSignInSubmit(user:any){
        dispatch(signIn
            ({
                accessToken:user.accessToken,
                displayName:user.displayName,
                email:user.email,
                emailVerified:user.emailVerified,
                phoneNumber:user.phoneNumber,
                uid:user.uid
            })
        )
        await updateUserProfile(user)
    }

    async function updateUserProfile(user:any){
        // const db = getFirestore()
        // const userRef = doc(db, "users", user.uid)
        // const userData = await getDoc(doc(collection(db, "users"), user.uid))
        // await setDoc(userRef, {
        //     emailverified: user.emailVerified,
        //     phonenumber: user.phoneNumber,
        //     dateJoined: userData.data()?.dateJoined ? userData.data()?.dateJoined :  Timestamp.fromDate(new Date())
        // }, { merge: true })
        const userData = await firestore().collection('users').doc(user.uid).get()
        
        firestore().collection('users').doc(user.uid)
        .update({
            emailverified: user.emailVerified,
            phonenumber: user.phoneNumber,
            dateJoined: userData.data()?.dateJoined ? userData.data()?.dateJoined :  firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Logined',
                textBody: 'success',
            })
            setSpinner(false)
        })
        .catch((error)=>{
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error,
            })
            setSpinner(false)
        })
    }

    return(
        <View style={styles.container}>
            {
                spinner && 
                <>
                        <Spinner
                        visible={true}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                </>
            }
            
            <Recaptcha
                ref={recaptcha}
                siteKey="6LfZ3jgfAAAAAGFJwLhl1Isd5dnX6jFdIZadob7c"
                baseUrl="http://localhost"
                onVerify={onVerify}
                onExpire={onExpire}
                onError={onError}
                size="invisible"
            />
            <PhoneInput
              ref={phoneInput}
              defaultValue={valuePhone}
              defaultCode="TH"
              layout="first"
              onChangeText={(text) => {
                setValuePhone(text)
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text)
              }}
              withShadow
              autoFocus
            />
            <Button
                onPress={()=>{send()}}
                mode="contained"
                style={styles.button}
                contentStyle={{
                    height: 50,
                    width: 300
                }}
            >
                Request OTP
            </Button>
            {
                confirm ? 
                <>
                    <TextInput
                        style={styles.input}
                        autoComplete={false}
                        placeholder="OTP Number"
                        value={inputOtp}
                        onChangeText={text => setInputOTP(text)}
                    />
                    <Button
                        onPress={()=>{confirmOTPCode()}}
                        mode="contained"
                        style={styles.button}
                        contentStyle={{
                            height: 50,
                            width: 300
                        }}
                    >
                        Sign In
                    </Button>
                </>
                :
                <>
                </>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    input: {
      width: 290,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginTop: 50,
      marginBottom: 10,
    },
    message: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 20,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    button: {
        marginTop: 20
    }
  })