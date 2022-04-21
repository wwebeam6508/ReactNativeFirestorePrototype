import React, { useEffect, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSelector } from "react-redux"
import { getUser } from "../../../../redux/slices/authSlice"
import { getJobsDetail, getRequestedJobData } from "./requestedJobProvider"
import moment from "moment"
import { Card, Title } from "react-native-paper"

export function RequestedJob() {
    const user_detail:userDetail = useSelector(getUser) as userDetail
    const [ requestedJobs, setRequestedJobs] = useState([])

    useEffect(()=>{
        async function init() {
            return await getRequestedJob()
        }
        init()
    },[])

    async function getRequestedJob(){
        const subscriber = getRequestedJobData(user_detail.uid).onSnapshot(await onResultGetRequestedJobs, onError)
        return subscriber
    }
    async function onResultGetRequestedJobs(querySnapshot) {
        
        let jobs = []
        querySnapshot.forEach(async (doc)=>{
            jobs.push(doc.data())
        })
        for (let i of jobs) {
            const job_detail = await getJobsDetail(i.jobId)
            i.job_detail = job_detail
            i.dateRequest = moment( new Date(i.dateRequest.seconds*1000)).format('DD/MM/YYYY hh:mm:ss')
            i.job_detail.dateCreated = moment( new Date(i.job_detail.dateCreated.seconds*1000)).format('DD/MM/YYYY hh:mm:ss')
            i.job_detail.dateEnd = moment( new Date(i.job_detail.dateEnd.seconds*1000)).format('DD/MM/YYYY hh:mm:ss')
            i.job_detail.dateStart = moment( new Date(i.job_detail.dateStart.seconds*1000)).format('DD/MM/YYYY hh:mm:ss')
        }
        setRequestedJobs(jobs)
    }

    function onError(error) {
        console.error(error)
    }
    
    return (
        <View style={{ flex: 1}}>
            <ScrollView>
                <View style={{marginTop:20,marginBottom:20}}>
                    <Ionicons style={{textAlign:"right",marginRight:25}} name="filter" size={26} ></Ionicons>
                </View>
                {
                    requestedJobs && requestedJobs.map((job,idx)=>{
                        return(
                            <Card key={idx} style={{borderColor:"#EEEDE7",borderWidth:1}}>
                                <Card.Content>
                                    <View style={[{flexDirection:'row',justifyContent: 'space-between'}]}>
                                        <Title>{job.job_detail.title}</Title>
                                    </View>
                                    <View style={[{flexDirection:'row',justifyContent: 'space-between'}]}>
                                        <View >
                                            <Text >สถานะ </Text>
                                            {(job.reqStatus === '1' && job.job_detail.status === '1') && <Text> รับแล้ว</Text>}
                                            {(job.reqStatus === '2' && job.job_detail.status === '1') && <Text> รอยืนยัน</Text>}
                                            {(job.reqStatus === '3' && job.job_detail.status === '2') && <Text> เสร็จสิ้น</Text>}    
                                            {(job.job_detail.status === '3') && <Text>งานถูกยกเลิก</Text>}
                                            <Text>เริ่มเมื่อ {job.job_detail.dateStart}</Text>
                                            <Text>{ job.job_detail.dateEnd && `สิ้นสุด ${job.job_detail.dateEnd}`}</Text>
                                        </View>
                                        <View >
                                            { job.isNoti && <Ionicons name="alert-outline" color={"red"} size={20} ></Ionicons>}
                                            <Text >สร้างโดย {`${job.job_detail.owner.firstname} ${job.job_detail.owner.lastname}`}</Text>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}