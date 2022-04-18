import MapboxGL from "@rnmapbox/maps"
import React from "react"
import { Button, StyleSheet, Text, View } from "react-native"
import { APP_MAP_BOX_GL } from "@env"

export default function MapTab(){
    MapboxGL.setAccessToken(APP_MAP_BOX_GL)

    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MapboxGL.MapView style={styles.map} />
        </View>
    )
}

const styles = StyleSheet.create({
    
    map: {
      ...StyleSheet.absoluteFillObject
    }
  })