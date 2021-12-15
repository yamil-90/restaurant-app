import React,  {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app"

export default function Restaurants({navigation}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo)=>{
            // console.log(userInfo);
            setUser(userInfo)
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