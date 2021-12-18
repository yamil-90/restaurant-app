import React from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps'
import createOpenLink from 'react-native-open-maps'

const Map = (props) => {
    const { location, name, height } = props;
 
 
 const openAppMapDelayed=()=>{
    console.log('openMap delayed');
    createOpenLink({
       latitude:location.latitude,
       longitude: location.longitude,
       zoom: 19,
       query: name
   })
}

    return (
        <>
        <MapView
            style={{ height: height, width: "100%" }}
            initialRegion={location}
            onPress={openAppMapDelayed}
        >
            <MapView.Marker

                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }} />
        </MapView>
        </>
    )
}

export default Map
