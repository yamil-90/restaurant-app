import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import 'firebase/firestore';
import Loading from '../../components/Loading';
import CarouselImage from '../../components/CarouselImage';

const db= firebase.firestore(firebaseApp)

const screenWidth = Dimensions.get('window').width;

const Restaurant = (props) => {
    const { route } = props;
    const { id, name,  } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        const { navigation } = props;
        navigation.setOptions({
            title: route.params.name
        })
        db.collection('restaurants')
        .doc(id)
        .get()
        .then((response)=>{
            const data = response.data();
            data.id = response.id;
            setRestaurant(data)
            console.log(response.data());
        })
    }, [])
    if(!restaurant) return  <Loading setIsVisible={true} text="cargando"/>
    return (
        <ScrollView>
            <CarouselImage
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <Text>{restaurant.name}</Text>
        </ScrollView>
    )
}

export default Restaurant

const styles = StyleSheet.create({

})