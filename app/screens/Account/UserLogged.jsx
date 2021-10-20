import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

import { Button } from "react-native-elements";
import firebase from "firebase";
import Toast from 'react-native-easy-toast';
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";


export default function UserLogged() {
    const toastRef = useRef()
    const [loading, setloading] = useState(false)
    const [userInfo, setuserInfo] = useState(null)
    const [loadingText, setLoadingText] = useState("")
    
    
    useEffect(() => {
        (async()=>{
            const user = await firebase.auth().currentUser;
            setuserInfo(user);
        })()
        return () => {
        }
    }, [])
    return (
        <View style={styles.viewUserInfo}>
            <Text >info User</Text>
            {userInfo && <InfoUser 
            toastRef={toastRef}
            userInfo={userInfo}
            setLoading={setloading}
            setLoadingText={setLoadingText}/>}
            <AccountOptions
                toastRef={toastRef}
                userInfo={userInfo}
            />
            <Button
                buttonStyle={styles.btnCloseSession}
                title="Cerrar sesión"
                onPress={() => firebase.auth().signOut()
                    .then(() => console.log('User signed out!'))}
                titleStyle={styles.btnCloseSessionText}
            />
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
            <Loading text={loadingText} isVisible={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSessionText: {
        color: "#00a680",

    }
});