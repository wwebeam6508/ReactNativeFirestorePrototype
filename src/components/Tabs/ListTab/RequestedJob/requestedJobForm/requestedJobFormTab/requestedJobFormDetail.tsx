import { StackActions } from "@react-navigation/native"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import Spinner from "react-native-loading-spinner-overlay/lib"
import { Avatar, Button, Text, Title } from "react-native-paper"
import imagesex from "../../../../../../ultis/imagesex"
import { getJobDetailData } from "../requestedJobFormProvider"

export function RequestedJobFormDetail({route, navigation}) {
    
    const [ jobRequestDetail, setJobRequestDetail ] = useState(route.params.jobRequestDetail)
    const [ jobDetail, setJobDetail ] = useState<any>({})
    const [ spinner, setSpinner] = useState(false)
    const [ amountTime, setAmountTime] = useState(0)
    useEffect(()=>{
        async function init(){
            getJobDetail()
            caculateAmountOfTime()
        }
        init()
    },[])
    
    function getJobDetail() {
        getJobDetailData(jobRequestDetail.jobId).then((job_data)=>{
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
        const timea = moment(jobRequestDetail.job_detail.dateStart,'DD/MM/YYYY hh:mm:ss')
        const timeb = moment(jobRequestDetail.job_detail.dateEnd,'DD/MM/YYYY hh:mm:ss')
        setAmountTime(moment.duration(timeb.diff(timea)).as('days'))
    }
    
    function renderApplicateButton() {
        if(jobDetail.status === "2" || jobDetail.status === "3"){
            return (
                <Button 
                    onPress={()=>{}}
                    mode="contained"
                    style={{marginTop: 10}}
                    contentStyle={{
                        backgroundColor: "#CAFFB3"
                    }} disabled={true}>งานเสร็จสิ้น</Button>
            )
        }else if (jobDetail.status === "1"){
            if(jobDetail.reqStatus === "1"){
                return (
                    <Button 
                        onPress={()=>{}}
                        mode="contained"
                        style={{marginTop: 10}}
                        contentStyle={{
                            backgroundColor: "#7FFF48"
                        }} disabled={true}>ได้รับการตอบรับ</Button>
                )
            }else if(jobDetail.reqStatus === "2" && jobDetail.isOpen){
                return (
                    <Button 
                        onPress={()=>{}}
                        mode="contained"
                        style={{marginTop: 10}}
                        contentStyle={{
                            backgroundColor: "#7F48FF"
                        }} disabled={true}>รอยืนยัน</Button>
                )
            }else if (jobDetail.isOpen){
                return (
                    <Button 
                        onPress={()=>{}}
                        mode="contained"
                        style={{marginTop: 10}}
                        contentStyle={{
                            backgroundColor: "#60B7CF"
                        }} >ยื่นคำขอ</Button>
                )
            } else if (!jobDetail.isOpen) {
                <Button 
                    onPress={()=>{}}
                    mode="contained"
                    style={{marginTop: 10}}
                    contentStyle={{
                        backgroundColor: "Grey"
                    }} disabled={true}>ปิดรับคำขอ</Button>
            }
        }
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
                    <Title style={{fontSize:28}}>
                        {jobDetail.title}
                    </Title>
                    <View style={{marginTop:20,flexDirection:'row',justifyContent: 'space-between'}}>
                        <Text style={{marginEnd:10}}>สร้างโดย</Text><Text>{jobRequestDetail.job_detail.owner.firstname} {jobRequestDetail.job_detail.owner.lastname}</Text>
                    </View>
                    <Avatar.Image size={115} source={jobRequestDetail.job_detail.owner.avatar ? { uri:jobRequestDetail.job_detail.owner.avatar } : imagesex(jobRequestDetail.job_detail.owner.sex)} />
                    <View style={{marginTop:20,flexDirection:'row',justifyContent: 'space-between'}}>
                        <Text style={{marginEnd:10}}>สร้างเมื่อ : {jobRequestDetail.job_detail.dateCreated}</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        {renderApplicateButton()}
                    </View>
                    <View style={{marginTop:50,flexDirection:'row',justifyContent: 'space-between'}}>
                        <Text style={{marginEnd:10}}>เริ่มเมื่อ : {jobRequestDetail.job_detail.dateStart}</Text>
                        {
                            jobRequestDetail.job_detail.dateEnd &&
                            <Text>สิ้นสุด : {jobRequestDetail.job_detail.dateEnd}</Text>
                        }
                    </View>
                    <Text>{ amountTime > 0 && `ระยะเวลาประมาณ ${Math.round(amountTime)} วัน`}</Text>
                    <View style={{marginTop:40}}>
                        <Button
                            onPress={()=>{navigation.dispatch(StackActions.push("MapPicker", {isViewer: true, initPos:jobDetail.position}))}}
                            mode="contained"
                            contentStyle={{
                                height: 50,
                                backgroundColor: "Blue"
                            }}
                        >
                            พิกัดแผนที่
                        </Button>
                    </View>
                    <Title style={{fontSize:18,marginTop:50}}>
                        รายละเอียด
                    </Title>
                    <Text style={{marginLeft:20,marginRight:20}}>
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
})