import { StackActions } from "@react-navigation/native"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification"
import Spinner from "react-native-loading-spinner-overlay/lib"
import { Avatar, Button, Text, TextInput, Title, TouchableRipple } from "react-native-paper"
import imagesex from "../../../../../../ultis/imagesex"
import { getJobDetailData, updateJobDetailData } from "../createdJobFormProvider"
import Ionicons from '@expo/vector-icons/Ionicons'
import DatePicker from "react-native-date-picker"
import { firebase } from "@react-native-firebase/firestore"
export function CreatedJobFormDetail({route, navigation}) {
    
    const [ jobCreatedDetail, setJobCreatedDetail ] = useState(route.params.jobCreatedDetail)
    const [ jobDetail, setJobDetail ] = useState<any>({})
    const [ spinner, setSpinner] = useState(false)
    const [ amountTime, setAmountTime] = useState(0)

    const [ formJobConditionEdit , setFormJobConditionEdit ] = useState<any>({})
    const [ formJobEdit , setFormJobEdit ] = useState<any>({})
    useEffect(()=>{
        async function init(){
            getJobDetail()
            caculateAmountOfTime()
            setObjectForEdit()
        }
        init()
    },[])

    function setObjectForEdit() {
        for (const key in jobDetail) {
            if( key === 'dateStart' || key === 'dateCreated' || key === 'dateEnd'){
                
            }
            setFormJobConditionEdit(prevForm=>({
                ...prevForm,
                [key]: false
            }))
        }
    }
    
    function getJobDetail() {
        getJobDetailData(jobCreatedDetail.jobId).then((job_data)=>{
            
            job_data.dateCreated = moment( new Date(job_data.dateCreated.seconds*1000)).format('MM/DD/YYYY hh:mm:ss')
            job_data.dateEnd = moment( new Date(job_data.dateEnd.seconds*1000)).format('MM/DD/YYYY hh:mm:ss')
            job_data.dateStart = moment( new Date(job_data.dateStart.seconds*1000)).format('MM/DD/YYYY hh:mm:ss')
            setJobDetail(job_data)
            setSpinner(false)
        }).catch((error)=>{
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error.message,
            })
            setSpinner(false)
        })
    }

    function caculateAmountOfTime() {
        const timea = moment(jobCreatedDetail.dateStart,'DD/MM/YYYY hh:mm:ss')
        const timeb = moment(jobCreatedDetail.dateEnd,'DD/MM/YYYY hh:mm:ss')
        setAmountTime(moment.duration(timeb.diff(timea)).as('days'))
    }

    function enableEditField(key) {
        for (const key in formJobEdit) {
            setFormJobConditionEdit(prevForm=>({
                ...prevForm,
                [key]: false
            }))
        }
        setFormJobConditionEdit(prevForm => ({
            ...prevForm,
            [key]: true
        }))
        setFormJobEdit(prevForm=>({
            ...prevForm,
            [key]: jobDetail[key]
        }))
    }

    function updateJobDetail(fieldEdit, key) {
        let jobDetail = {}
        if ( key === 'dateStart' || key === 'dateEnd') {
            jobDetail = {
                [key]: firebase.firestore.Timestamp.fromDate(fieldEdit) 
            }
        } else {
            jobDetail = {
                [key]: fieldEdit
            }
        }
        updateJobDetailData(jobCreatedDetail.jobId, jobDetail).then(()=>{
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'บันทึกสำเร็จ'
            })
            setFormJobConditionEdit(prevForm => ({
                ...prevForm,
                [key]: false
            }))
            if ( key === 'dateStart' || key === 'dateEnd') {
                setJobDetail(prevForm => ({
                    ...prevForm,
                    [key]: moment( new Date(jobDetail[key].seconds*1000)).format('MM/DD/YYYY hh:mm:ss')
                }))
            } else {
                setJobDetail(prevForm => ({
                    ...prevForm,
                    [key]: fieldEdit
                }))
            }
        })
        .catch((error)=>{
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error.message,
            })
        })
    }

    return(
        <View style={{ height:"100%",
        backgroundColor: "#F9F9F9"}}>
        {
            spinner && 
            <Spinner
                    visible={true}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
            />
        }
            <ScrollView>
                <View style={styles.form}>
                    <View style={styles.inputform}>
                        {
                            formJobConditionEdit.title ? 
                            <>
                                <TouchableRipple
                                    style={{width:30,height:30,marginRight:20}} 
                                    onPress={()=>{
                                        setFormJobConditionEdit(prevForm => ({
                                            ...prevForm,
                                            ['title']: false
                                        }))}}
                                    rippleColor="rgba(0, 0, 0, 0)"
                                >
                                    <Ionicons style={{fontWeight:"bold"}} name="close" size={30} color="black" />
                                </TouchableRipple>
                                <TextInput
                                    style={styles.input}
                                    autoComplete={false}
                                    label="title"
                                    placeholder="title"
                                    value={formJobEdit.title}
                                    onChangeText={text => { 
                                        setFormJobEdit(prevForm => ({
                                            ...prevForm,
                                            title: text
                                        }))
                                    }}
                                />
                                <TouchableRipple
                                    style={{width:25,height:30,marginLeft:15}} 
                                    onPress={ () => {updateJobDetail(formJobEdit.title, 'title')}}
                                    rippleColor="rgba(0, 0, 0, 0)"
                                >
                                    <Ionicons style={{fontWeight:"bold"}} name="checkmark" size={30} color="black" />
                                </TouchableRipple>
                            </>
                            :
                            <>
                                <Title style={{fontSize:28}}>
                                    {jobDetail.title}
                                </Title>
                                <TouchableRipple
                                    style={{width:50,height:30,marginRight:20}} 
                                    onPress={()=>{enableEditField("title")}}
                                    rippleColor="rgba(0, 0, 0, 0)"
                                >
                                    <Ionicons style={{fontWeight:"bold", marginLeft: 15, marginTop: 5}}  name="pencil" size={20} color="black" />
                                </TouchableRipple>
                            </>
                        }
                    </View>
                    
                    <View style={{...styles.inputform,marginTop:20}}>
                        <Text style={{marginEnd:10}}>สร้างเมื่อ : {jobDetail.dateCreated}</Text>
                    </View>
                    <View style={{...styles.inputform, marginTop:50}}>
                        <Text style={{marginEnd:10}}>เริ่มเมื่อ : {jobDetail.dateStart}</Text>
                        <TouchableRipple
                            style={{width:50,height:30,marginRight:20}} 
                            onPress={()=>{enableEditField("dateStart")}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold", marginLeft: 15, marginTop: 5}}  name="pencil" size={21} color="black" />
                        </TouchableRipple>
                        <DatePicker
                            modal
                            mode="datetime"
                            open={formJobConditionEdit.dateStart}
                            date={new Date(jobDetail.dateStart ? jobDetail.dateStart : null)}
                            onConfirm={async (date) => {
                                updateJobDetail(
                                    date, 'dateStart')
                                setFormJobConditionEdit(prevForm=>({
                                    ...prevForm,
                                    dateStart: false
                                }))
                            }}
                            onCancel={() => {
                                setFormJobConditionEdit(prevForm=>({
                                    ...prevForm,
                                    dateStart: false
                                }))
                            }}
                        />
                    </View>
                    <View style={{...styles.inputform, marginTop:20}}>
                        <Text style={{marginEnd:10}}>สิ้นสุด : {jobDetail.dateEnd}</Text>
                        <TouchableRipple
                            style={{width:50,height:30,marginRight:20}} 
                            onPress={()=>{enableEditField("dateEnd")}}
                            rippleColor="rgba(0, 0, 0, 0)"
                        >
                            <Ionicons style={{fontWeight:"bold", marginLeft: 15, marginTop: 5}}  name="pencil" size={21} color="black" />
                        </TouchableRipple>
                        <DatePicker
                            modal
                            mode="datetime"
                            open={formJobConditionEdit.dateEnd}
                            date={new Date(jobDetail.dateEnd ? jobDetail.dateEnd : null)}
                            onConfirm={async (date) => {
                                updateJobDetail(
                                    date, 'dateEnd')
                                setFormJobConditionEdit(prevForm=>({
                                    ...prevForm,
                                    dateEnd: false
                                }))
                            }}
                            onCancel={() => {
                                setFormJobConditionEdit(prevForm=>({
                                    ...prevForm,
                                    dateEnd: false
                                }))
                            }}
                        />
                    </View>
                    <Text>{ amountTime > 0 && `ระยะเวลาประมาณ ${Math.round(amountTime)} วัน`}</Text>
                    <View style={{marginTop:40,marginBottom:40}}>
                        <Button
                            onPress={()=>{
                                updateJobDetail(
                                 !jobDetail.isReward, 'isReward')
                            }}
                            mode="contained"
                            contentStyle={{
                                height: 50,
                                backgroundColor: `${jobDetail.isReward ? "green": "red"}`
                            }}
                        >
                            { jobDetail.isReward ? `มีรางวัล` : `ไม่มีรางวัล`}
                        </Button>
                    </View>
                    <View style={{...styles.inputform, marginTop: 0}}>
                        {
                            jobDetail.isReward && (
                                formJobConditionEdit.reward ? 
                            <>
                                <TouchableRipple
                                    style={{width:50,height:30,marginRight:20}} 
                                    onPress={()=>{
                                        setFormJobConditionEdit(prevForm => ({
                                            ...prevForm,
                                            ['reward']: false
                                        }))}}
                                    rippleColor="rgba(0, 0, 0, 0)"
                                >
                                    <Ionicons style={{fontWeight:"bold", marginLeft: 15, marginTop: 5}} name="close" size={30} color="black" />
                                </TouchableRipple>
                                <TextInput
                                    style={styles.input}
                                    autoComplete={false}
                                    label="reward"
                                    placeholder="reward"
                                    value={formJobEdit.reward}
                                    onChangeText={text => { 
                                        setFormJobEdit(prevForm => ({
                                            ...prevForm,
                                            reward: text
                                        }))
                                    }}
                                />
                                <TouchableRipple
                                    style={{width:25,marginLeft:15}} 
                                    onPress={ () => {updateJobDetail(formJobEdit.reward, 'reward')}}
                                    rippleColor="rgba(0, 0, 0, 0)"
                                >
                                    <Ionicons style={{fontWeight:"bold"}} name="checkmark" size={30} color="black" />
                                </TouchableRipple>
                            </>
                            :
                            <>
                                <Text style={{fontSize:16}}>
                                    รางวัล: {jobDetail.reward}
                                </Text>
                                <TouchableRipple
                                    style={{width:40, marginLeft: 20}} 
                                    onPress={()=>{enableEditField("reward")}}
                                    rippleColor="rgba(0, 0, 0, 0)"
                                >
                                    <Ionicons style={{fontWeight:"bold", marginLeft: 10}}  name="pencil" size={20} color="black" />
                                </TouchableRipple>
                            </>
                            )
                        }
                    </View>
                    <View style={{marginTop:40,marginBottom:40}}>
                        <Button
                            onPress={()=>{navigation.dispatch(StackActions.push("MapPicker", {isViewer: false, initPos:jobDetail.position, initZoom: jobDetail.zoomLevel, jobId:jobCreatedDetail.jobId}))}}
                            mode="contained"
                            contentStyle={{
                                height: 50,
                                backgroundColor: "blue"
                            }}
                        >
                            ระบุพิกัดแผนที่
                        </Button>
                    </View>
                    <Title style={{fontSize:18,marginTop:1}}>
                        รายละเอียด
                    </Title>
                    <Text style={{marginLeft:20,marginRight:20,marginBottom:30}}>
                        { jobDetail.detail }
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
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
    input: {
        textAlign: "center",
        width: 250,
        height: 50,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    }
})