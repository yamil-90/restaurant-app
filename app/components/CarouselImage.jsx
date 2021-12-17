import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native-elements';
import Carousel from "react-native-snap-carousel";

export default function CarouselImage(props) {
    const {arrayImages, height, width}= props;
    
const renderItem=(props)=>{
    const {item} = props;
    return <Image lo style={{width,height}} source={{uri: item}}/>
}

    return (
        <View>
            <Carousel
            layout={'default'}
            data={arrayImages}
            sliderWidth={width}
            itemWidth={width}
            renderItem={(item)=>renderItem(item)}
            />
        </View>
    )
}

const styles = StyleSheet.create({})
