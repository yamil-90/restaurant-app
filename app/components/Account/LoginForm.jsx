import React, { useState } from "react";
import { View, StyleSheet  } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import { validateEmail } from "../../utils/validations";
// import {getAuth, signInWithEmailAndPassword} from "@firebase/auth";
import Loading from "../Loading";
import { useNavigation } from "@react-navigation/native";
import firebase from 'firebase/app';

export default function LoginForm(props) {
    const { toastRef } = props;
    const [formData, setformData] = useState(defaultFormData());
    const [showPassword, setshowPassword] = useState(false);
    const [loading, setloading] = useState(false)
    
    const navigation = useNavigation();

    const onChange = (e, type)=>{
        setformData({...formData, [type]: e.nativeEvent.text})
    }
    const onSubmit = () =>{
        if(isEmpty(formData.email) || isEmpty(formData.password)){
            toastRef.current.show("Todos los campos son obligatorios")
        }else if(!validateEmail(formData.email)){
            toastRef.current.show("El email no es valido")
        }else{
            setloading(true)
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            .then(()=>{
                console.log("redirect to navigation")
                setloading(false)
                navigation.navigate("AccountStack")

            })
            .catch((error)=>{
                console.log(error)
                setloading(false)
                toastRef.current.show("datos invalidos")
            })
        }
    }
    return (
        <View style={styles.formContainer}>
        <Input
            placeholder="correo electronico"
            containerStyle={styles.inputForm}
            onChange={(e)=> onChange(e, "email")}
            rightIcon={
                <Icon
                    type="material-community"
                    name="at"
                    style={styles.iconRight}
                />
            }
        />
        <Input
            placeholder="Contraseña"
            containerStyle={styles.inputForm}
            password={true}
            secureTextEntry={!showPassword}
            onChange={(e)=> onChange(e, "password")}
            rightIcon={
                <Icon
                    type="material-community"
                    name={showPassword?"eye-off":"eye"}
                    style={styles.iconRight}
                    onPress={()=>{setshowPassword(!showPassword)}}
                />
            
            }
            
        />
        <Button
        title="iniciar sesion"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
        />
        <Loading isVisible={loading} text="Iniciando sesión"/>
    </View>
    )
}

function defaultFormData() {
    return {
        email:"",
        password:""
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        marginTop:30

    },
    inputForm:{
        width:"100%",
        marginTop:20
    },
    btnContainer:{
        marginTop:20,
        width:"95%"
    },
    btnLogin:{
        backgroundColor:"#00a680"
    },
    iconRight:{
        color:"#c1c1c1"
    }
})