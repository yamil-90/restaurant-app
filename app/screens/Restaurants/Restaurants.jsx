import React,  {useState, useEffect, useCallback} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import {useFocusEffect} from "@react-navigation/native"
import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import 'firebase/firestore';

import ListRestaurants from "../../components/Restaurants/ListRestaurants";

const db = firebase.firestore(firebaseApp);
export default function Restaurants({navigation}) {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(null)
    const [startRestaurants, setStartRestaurants] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const limitRestaurant = 6
    
    useFocusEffect(
        useCallback(()=>{
            db.collection('restaurants')
            .get()
            .then((snap)=>{
                setTotalRestaurants(snap.size)
            })
            const resultRestaurants = [];
    
            db.collection('restaurants')
            .orderBy('createdAt', 'desc')
            .limit(limitRestaurant).get()
            .then((response)=>{
                // console.log(response)
                setStartRestaurants(response.docs[response.docs.length -1])
                response.forEach((doc)=>{
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurants.push(restaurant);
                    setRestaurants(resultRestaurants);
                })
            })
        },[])
    )

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo)=>{
            
            setUser(userInfo)
        })
    }, [])

    const handleLoadMore=()=>{
        const resultRestaurants=[];
        restaurants.lenght < totalRestaurants && setIsLoading(true)
        db.collection('restaurants')
        .orderBy('createdAt', 'desc')
        .startAfter(startRestaurants.data().createdAt)
        .limit(limitRestaurant)
        .get()
        .then((response)=>{
            if(response.docs.length >0){
                setStartRestaurants(response.docs[response.docs.length-1]);
            }else{
                setIsLoading(false);
            }
            response.forEach((doc)=>{
                const restaurant = doc.data();
                restaurant.id=doc.id;
                resultRestaurants.push(restaurant)
            })
            setRestaurants([...restaurants, ...resultRestaurants])
        })
    }

    return (
        <View style={styles.viewBody}>

            <ListRestaurants
            restaurants={restaurants}
            handleLoadMore={handleLoadMore}
            isLoading={isLoading}
            
            />
            {user && 
            <Icon
                reverse
                type='material-community'
                name='plus'
                color='#00a680'
                containerStyle={styles.btnContainer}
                onPress={()=>navigation.navigate('addRestaurant')}
            />}
        </View>
    )
}
const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        elevation: 4,
        // background color must be set
        backgroundColor: "#0000"
    }
})