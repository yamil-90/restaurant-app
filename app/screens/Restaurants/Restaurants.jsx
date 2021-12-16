import React,  {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function Restaurants({navigation}) {
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(null)
    const [startRestaurants, setStartRestaurants] = useState(null)
    const limitRestaurant = 6
    
    // console.log(totalRestaurants)
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo)=>{
            // console.log(userInfo);
            setUser(userInfo)
        })
    }, [])

    useEffect(() => {
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
            setStartRestaurants(response.docs[response.docs.lenght -1])
            response.forEach((doc)=>{
                const restaurant = doc.data();
                restaurant.id = doc.id;
                console.log(restaurant);
            })
        })
    }, [])
    return (
        <View style={styles.viewBody}>

            <Text >
                Restaurants....
            </Text>
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