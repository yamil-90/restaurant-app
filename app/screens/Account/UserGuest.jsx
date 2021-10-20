import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Login from "./Login";

export default function UserGuest(){
    const navigation = useNavigation();
    return (
    <ScrollView contentContainerStyle={styles.viewBody2}       
        >
        <Image 
            style={styles.image}
            source={require("../../../assets/img/user-guest.jpg")}
            resizeMode="contain"
        />
        <Text style={styles.title}>Consulta tu perfil</Text>
        <Text style={styles.description}>
            Una app para describir y calificar restaurantes, vota por tu mejor restaurant y mira como crece o busca los mejores restaurantes para visitar
        </Text>
        <View style={styles.viewBtnStyle}>
            <Button
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                title="Ver tu perfil"
                onPress={()=>navigation.navigate("Login")}
            />
        </View>
    </ScrollView>
    )

}
const styles = StyleSheet.create({
    
    viewBody2:{
        flexGrow: 1, 
        justifyContent: 'center',
        marginLeft:30,
        marginRight: 30,
    },
    image:{
        height:300,
        width:"100%",
        marginBottom: 40
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom:10,
        textAlign: "center"
    },
    description:{
        textAlign: "center",
        justifyContent:"center",
        marginBottom: 20
    },
    button:{
        backgroundColor: "#00c680"
    },
    buttonContainer:{
        width:"70%"
    },
    viewBtnStyle:{
        flex:1,
        alignItems:"center"
    }
})