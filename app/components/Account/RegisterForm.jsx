import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Loading from "../Loading";
import { Input } from "react-native-elements/dist/input/Input";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { Button } from "react-native-elements";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";


export default function RegisterForm(props) {
    const {toastRef} = props;
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [formData, setformData] = useState(defaultFormValue())
    
    const navigation = useNavigation();
    const [loading, setloading] = useState(false)

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)) {
            toastRef.current.show("todos los campos son obligatorios")
            // console.log("todos los campos son obligatorios");
        } else if (!validateEmail(formData.email)) {
            // console.log('email no es correcto');
            toastRef.current.show("El email no es correcto")
        } else if (formData.password != formData.repeatPassword) {
            toastRef.current.show("Los campos de contraseña y repetir contraseña deben ser iguales")
            // console.log("los campos de contraseña no son iguales");
        } else if (size(formData.password) < 6) {
            toastRef.current.show("contraseña tiene que tener mas de 6 caracteres");
        } else {
            setloading(true)
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then(()=>{
                console.log("redirect to navigation")
                setloading(false)
                navigation.navigate("AccountStack")

            })
            .catch(()=>{
                setloading(false)
                toastRef.current.show("Email ya esta en uso")
            })
        }
    }
    const onChange = (e, type) => {
        // esta funcion recibe los params y el typo de input modificado para clasificarlo
        e.persist()
        // e.persist() es para que no se resetee el e, sino da null
        // setformData({ [type]: e.nativeEvent.text }) esto no funciona asi que usamos ...formData
        setformData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                password={true}
                secureTextEntry={!showPassword}
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off" : "eye"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                password={true}
                secureTextEntry={!showRepeatPassword}
                placeholder="Repita la contraseña"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showRepeatPassword ? "eye-off" : "eye"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }

            />

            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading isVisible={loading}/>
        </View>
    )
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
        repeatPassword: ""

    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
})