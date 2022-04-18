import React, { useRef } from "react"
import { Button, View } from "react-native"
import MapView from "react-native-map-clustering"
import { Marker } from "react-native-maps"

const INITIAL_REGION = {
    latitude: 52.5,
    longitude: 19.2,
    latitudeDelta: 8.5,
    longitudeDelta: 8.5,
}
export default function MapTab(){
    const mapRef = useRef<any>()
    const animateToRegion = () => {
        let region = {
          latitude: 42.5,
          longitude: 15.2,
          latitudeDelta: 7.5,
          longitudeDelta: 7.5,
        };
    
        mapRef.current.animateToRegion(region, 2000);
    }
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MapView
                ref={mapRef}
                initialRegion={INITIAL_REGION}
                style={{ flex: 1 }}
            />
            <Button onPress={animateToRegion} title="Animate" />
        </View>
    )
}