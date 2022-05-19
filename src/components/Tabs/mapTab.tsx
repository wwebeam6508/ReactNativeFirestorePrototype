import MapboxGL, { Logger } from "@rnmapbox/maps"
import React, { useEffect, useState } from "react"
import { Button, StyleSheet, Text, View } from "react-native"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import Geolocation from 'react-native-geolocation-service'
import Spinner from "react-native-loading-spinner-overlay/lib"
export default function MapTab(){

    const [currentPosition, setCurrentPosition] = useState([0,0])
    const [ spinner, setSpinner] = useState(false)

    useEffect(()=>{
        getPosisition()
    },[])

    function getPosisition() {
        setSpinner(true)
        Geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition([position.coords.longitude, position.coords.latitude])
                setSpinner(false)
            },
            (error) => {
                setSpinner(false)
                // See error code charts below.
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: error.message,
                })
                console.log(error.code, error.message)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
        Logger.setLogCallback(log => {
            const { message } = log;
          
            // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
            if (
              message.match('Request failed due to a permanent error: Canceled') ||
              message.match('Request failed due to a permanent error: Socket Closed')
            ) {
              return true;
            }
            return false;
        })
        
    }


    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                spinner && 
                <Spinner
                        visible={true}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                />
            }
            <MapboxGL.MapView style={styles.map} >
                <MapboxGL.Camera zoomLevel={10}
                    centerCoordinate={currentPosition} />
            </MapboxGL.MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    
    map: {
        width: "100%",
        height: "100%"
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
  })