import MapboxGL from "@rnmapbox/maps"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { TouchableRipple } from "react-native-paper"
import Ionicons from '@expo/vector-icons/Ionicons'
import { StackActions } from "@react-navigation/native"


export function MapPicker({route, navigation}) {
    console.log()
    const [ isViewer, setIsViewer ] = useState(route.params.isViewer)
    const [ initPos, setInitPos ] = useState([route.params.initPos._longitude,route.params.initPos._latitude])

    return(
        <View style={{ flex: 1}}>
            <TouchableRipple
                style={{marginLeft:15,marginTop:15,paddingBottom:13,width:55}}
                onPress={() => navigation.dispatch(StackActions.pop(1))}
                rippleColor="rgba(0, 0, 0, 1)"
            >
                <Ionicons style={{textAlign:"center"}} name="arrow-back" size={32} color="black" />
            </TouchableRipple>
            <MapboxGL.MapView style={styles.map} >
                <MapboxGL.Camera 
                    zoomLevel={10}
                    centerCoordinate={initPos}
                />
            </MapboxGL.MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    map:{
        height:"100%",
        width: "100%"
    }
})