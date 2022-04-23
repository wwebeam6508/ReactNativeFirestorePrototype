import MapboxGL from "@rnmapbox/maps"
import React, { useEffect } from "react"
import { Button, StyleSheet, Text, View } from "react-native"
export default function MapTab(){

    useEffect(()=>{
    },[])


    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MapboxGL.MapView style={styles.map} />
        </View>
    )
}

const styles = StyleSheet.create({
    
    map: {
        width: "100%",
        height: "100%"
    }
  })