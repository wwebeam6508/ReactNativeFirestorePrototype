import MapboxGL from "@rnmapbox/maps"
import React from "react"
import { Button, StyleSheet, Text, View } from "react-native"
import {  REACT_APP_MAP_BOX_GL } from "@env"

export default function MapTab(){

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