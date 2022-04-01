import React, { useRef, useState } from "react"
import { StyleSheet, TextInput, View } from "react-native"
import { Timestamp } from "firebase/firestore"
import { Button, Text } from "react-native-paper"
import PhoneInput from "react-native-phone-number-input"
import Recaptcha, { RecaptchaHandles } from "react-native-recaptcha-that-works"
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import auth from '@react-native-firebase/auth'
import { FirebaseAuthTypes } from "@react-native-firebase/auth"

export default function SignIn() {
    const phoneInput = useRef<PhoneInput>(null)
    const [valuePhone, setValuePhone] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [formattedValue, setFormattedValue] = useState("")
    const [input_otp, setOTP] = useState("")
    const [isSendOTP, setisSendOTP] = useState(false)
    const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult>()
    let OTPRender
    if(isSendOTP){
        OTPRender =  (
            <>
                <TextInput
                    value={input_otp}
                    onChangeText={(otp) => setOTP(otp)}
                    placeholder={'OTP'}
                    style={styles.input}
                />
                
                <Button
                    onPress={()=>{}}
                    mode="contained"
                >
                    Sign In
                </Button>
            </>
        
        )
    }
    const recaptcha = useRef<RecaptchaHandles>(null)

    const send = () => {
        console.log('send!')
        recaptcha.current?.open()
    }

    async function onVerify() {
        try {
            const confirmation = await auth().signInWithPhoneNumber(valuePhone);
            setConfirm(confirmation);
        } catch (error:any) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error,
            })
        }
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

    return(
        <View style={styles.container}>
            {showMessage && (
                <View style={styles.message}>
                <Text>Value : {valuePhone}</Text>
                <Text>Formatted Value : {formattedValue}</Text>
                <Text>Valid : {valuePhone ? "true" : "false"}</Text>
                </View>
            )}
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
              defaultCode="DM"
              layout="first"
              onChangeText={(text) => {
                setValuePhone(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
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
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    input: {
      width: 200,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
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
        marginTop: 50
    }
  })