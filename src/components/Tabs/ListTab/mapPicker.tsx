import MapboxGL from "@rnmapbox/maps"
import { useState } from "react"
import { StyleSheet, Text, View,Image } from "react-native"
import { Button, Title, TouchableRipple } from "react-native-paper"
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackActions } from "@react-navigation/native"
import firestore from '@react-native-firebase/firestore'
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import Spinner from "react-native-loading-spinner-overlay/lib"
export function MapPicker({route, navigation}) {
    const [ isViewer, setIsViewer ] = useState(route.params.isViewer)
    const [ initPos, setInitPos ] = useState([route.params.initPos._longitude,route.params.initPos._latitude])
    const [ initZoom, setInitZoom ] = useState(route.params.initZoom)

    const [ formPos, setFormPos] = useState([route.params.initPos._longitude,route.params.initPos._latitude])
    const [ formZoom, setFormZoom] = useState(route.params.initZoom)
    const [ jobId, setJobId] = useState(route.params.jobId)
    const [ spinner, setSpinner] = useState(false)

    async function savePosition() {
        console.log(route.params.jobId)
        setSpinner(true)
        firestore()
        .collection('jobs')
        .doc(jobId)
        .update({
            position:new firestore.GeoPoint(formPos[1], formPos[0]),
            zoomLevel: formZoom
        })
        .then(()=>{
            setInitPos([formPos[0], formPos[1]])
            setInitZoom(formZoom)
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: "บันทึกสำเร็จ",
            })
            setSpinner(false)
        })
        .catch((error)=>{
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error.message,
            })
            setSpinner(false)

        })
    }

    return(
        <View style={{ flex: 1}}>
            {
                spinner && 
                <Spinner
                    visible={true}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            }
            <View style={{backgroundColor:"white", flexDirection:"row"}}>
                <TouchableRipple
                    style={{marginLeft:15,marginTop:15,paddingBottom:13,width:55}}
                    onPress={() => navigation.dispatch(StackActions.pop(1))}
                    rippleColor="rgba(0, 0, 0, 1)"
                >
                    <Ionicons style={{textAlign:"center"}} name="arrow-back" size={32} color="black" />
                </TouchableRipple>
                {
                    isViewer ?
                        <Title style={{marginTop: 20}}> แผนที่พิกัด </Title>
                    :
                        <Title style={{marginTop: 20}}> ระบุพิกัดแผนที่ </Title>
                }
            </View>
            <View  style={{height:"100%"}}>
                <View  style={{width:"100%", backgroundColor:"transparent",position:'absolute',zIndex:10}}>
                    <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                        {
                            ( initPos[0] !== formPos[0] && initPos[1] !== formPos[1] ) || ( initZoom !== formZoom ) ? 
                            <>
                                <Button
                                onPress={()=>{
                                    setFormPos(initPos)
                                }}
                                mode="contained"
                                style={{marginTop: 10, marginLeft: 10}}
                                contentStyle={{
                                    backgroundColor: "purple",
                                    height: 50
                                }}
                                >
                                    Reset
                                </Button>

                                <Button
                                    onPress={async ()=>{
                                        await savePosition()
                                    }}
                                    mode="contained"
                                    style={{marginTop: 10, marginRight: 10}}
                                    contentStyle={{
                                        backgroundColor: "green",
                                        height: 50
                                    }}
                                >
                                    บันทึก
                                </Button>
                            </>
                            :
                            <>
                            </>
                        }
                    </View>
                </View>
                <MapboxGL.MapView style={styles.map} onPress={(feature:any)=>{!isViewer && setFormPos(feature.geometry.coordinates)}} onRegionIsChanging={(e)=>{setFormZoom(e.properties.zoomLevel)}} >
                    <MapboxGL.Camera 
                        zoomLevel={initZoom}
                        centerCoordinate={initPos}
                        
                    />
                    <MapboxGL.MarkerView id={'hello'} coordinate={formPos} >
                        <View style={styles.markerContainer}>
                            <Image
                                source={require("../../../assets/icons8-location-96.png")}
                                style={{
                                    width: 20,
                                    height: 20,
                                    resizeMode: "cover"
                                }}
                                />
                        </View>
                    </MapboxGL.MarkerView>
                </MapboxGL.MapView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    map:{
        flex: 1,
        height:"100%",
        width: "100%"
    },
    markerContainer: {
        alignItems: "center",
        width: 60,
        backgroundColor: "transparent",
        height: 70
    },
    textContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        paddingHorizontal: 5,
        flex: 1,
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
})