import { StackActions } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, Card, Text, Title } from "react-native-paper"
import { getTasksData } from "../createdJobFormProvider"

export function CreatedJobFormTask({route, navigation}) {


    const [ jobCreatedDetail, setJobCreatedDetail ] = useState(route.params.jobCreatedDetail)
    const [ tasks , setTasks ] = useState([])
    useEffect(()=>{
        async function init() {
            await getTasks()
        }
        init()
    },[])

    async function getTasks() {
       const taskdata = await getTasksData(jobCreatedDetail.jobId)
       setTasks(taskdata)
    }
    
    return(
        <View style={{ flex: 1}}>
            {
                tasks && tasks.map((task, idx)=>{
                    return(
                        <Card key={idx} style={{borderColor:"#EEEDE7",borderWidth:1}} >
                            <Title style={{marginLeft: 10, marginRight: 10}}>{task.title}</Title>
                            <Text style={{marginLeft: 10, marginRight: 10}}>{task.detail}</Text>
                            
                            <View style={styles.inputform}>
                                <Button
                                    onPress={()=>{navigation.dispatch(StackActions.push("MapPicker", {isViewer: true, initPos:task.position}))}}
                                    mode="contained"
                                    style={{marginTop: 20, marginBottom: 20}}
                                    contentStyle={{
                                        backgroundColor: "blue",
                                        width:120
                                    }}
                                >
                                    ดูพิกัดแผนที่
                                </Button> 
                            </View>
                        </Card>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    
    inputform:{  
        marginTop: 5,           
        flexWrap: 'wrap', 
        alignItems: 'center',
        justifyContent: "center",
        flexDirection:'row'
    }
})