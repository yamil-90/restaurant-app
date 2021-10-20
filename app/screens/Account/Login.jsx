import React, { useRef }  from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import LoginForm from "../../components/Account/LoginForm";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


import Toast from "react-native-easy-toast";

export default function Login() {
    const toastRef = useRef()
    return (
        <KeyboardAwareScrollView>
            <Image
                source={require("../../../assets/img/tenedores-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef}/>
                <CreateAccount />
            </View>
            <Divider style={styles.divider} />
            <Text>Social Login</Text>
            <Toast 
                ref={toastRef}
                position="center"
                opacity={0.9}
            /> 
        </KeyboardAwareScrollView>
    )
}

function CreateAccount(props) {
    const navigation = useNavigation();
    return (
        <Text style={styles.textRegister}>
            Aun no tienes una cuenta?{" "}
            <Text
                onPress={() => navigation.navigate("register")}
                style={styles.btnRegister}>
                Regístrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold"
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40
    }
});

