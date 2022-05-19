import moment from "moment"
import React, { useEffect, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { Card, Title } from "react-native-paper"
import { useSelector } from "react-redux"
import { getUser } from "../../../../redux/slices/authSlice"
import { getCreatedJobData } from "./createdJobProvider"
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackActions, useNavigation } from "@react-navigation/native"
export function CreatedJob() {
    const navigation = useNavigation()
    const user_detail:userDetail = useSelector(getUser) as userDetail
    const [ createdJobs, setCreatedJobs] = useState([])

    useEffect(()=>{
        getCreatedJobs()
    },[])

    function getCreatedJobs(){
        const subscriber = getCreatedJobData(user_detail.uid).onSnapshot(onResultGetCreatedJobs, onError)
        return subscriber
    }
    function onResultGetCreatedJobs(querySnapshot) {
        
        let jobs = []
        querySnapshot.forEach(doc => {
            const jobData = doc.data()
            jobs.push({
                dateCreated: jobData.dateCreated,
                dateEnd: jobData.dateEnd,
                dateStart: jobData.dateStart,
                isNoti: jobData.isNoti,
                title: jobData.title,
                jobId: jobData.jobId

            })
            jobs[jobs.length - 1].jobId = doc.id
        })
        for (let i of jobs) {
            i.dateCreated = moment( new Date(i.dateCreated.seconds*1000)).format('MM/DD/YYYY hh:mm:ss')
            i.dateEnd = moment( new Date(i.dateEnd.seconds*1000)).format('MM/DD/YYYY hh:mm:ss')
            i.dateStart = moment( new Date(i.dateStart.seconds*1000)).format('MM/DD/YYYY hh:mm:ss')
        }
        setCreatedJobs(jobs)
    }

    function onError(error) {
        console.error(error);
    }
    
    return (
        <View style={{ flex: 1}}>
            <ScrollView>
                <View style={{marginTop:20,marginBottom:20}}>
                    <Ionicons style={{textAlign:"right",marginRight:25}} name="filter" size={26} ></Ionicons>
                </View>
                {
                    createdJobs && createdJobs.map((job,idx)=>{
                        return(
                            <Card key={idx} style={{borderColor:"#EEEDE7" ,borderWidth:1}} onPress={()=>{navigation.dispatch(StackActions.push("CreatedJobForm", job))}}>
                                <Card.Content>
                                    <View style={[{flexDirection:'row', justifyContent: 'space-between'}]}>
                                        <Title>{job.title}</Title>
                                        { job.isNoti && <Ionicons name="alert-outline" color={"red"} size={20} ></Ionicons>}
                                    </View>
                                    <View style={[{flexDirection:'row', justifyContent: 'space-between'}]}>
                                        <View >
                                            <Text >เริ่ม {job.dateStart}</Text>
                                            <Text >สิ้นสุด {job.dateEnd}</Text>
                                        </View>
                                        <View >
                                            <Text >สร้างเมื่อ {job.dateCreated}</Text>
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