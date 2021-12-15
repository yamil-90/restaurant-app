import React, {useState, useRef} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from "../../components/Loading";
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm';

export default function ({navigation}){
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef();
    return (
        <View>
            <AddRestaurantForm toastRef={toastRef} setIsLoading={setIsLoading} navigation={navigation}/>
            <Toast ref={toastRef} position='center' opacity={0.9}/>
            <Loading isVisible={isLoading} text='creando restaurante'/>
        </View>
    )
}