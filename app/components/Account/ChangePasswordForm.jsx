import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import {size} from 'lodash';
import { reAuthenticate } from '../../utils/api';
import * as firebase from 'firebase';

export default function ChangePasswordForm(props){
    const {setShowModal}=props;
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData]=useState(defaultValue())
    const [errors, setErrors] = useState({});

    const onChange=(e, type)=> {
        // console.log(e.nativeEvent.text)
        setFormData({...formData, [type]:e.nativeEvent.text })
    }
    const onSubmit = async ()=>{
        let isSetError = true;
        let errorsTemp ={};
        setErrors({});
        if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
            errorsTemp={
                password: !formData.password ? 'la contraseña no puede estar vacia':'',
                newPassword: !formData.newPassword ? 'la contraseña no puede estar vacia' :'',
                repeatNewPassword: !formData.repeatNewPassword ? 'la contraseña no puede estar vacia' :'',
            }
        }else if(formData.newPassword !==formData.repeatNewPassword){
            errorsTemp={
                newPassword:'los campos deben ser iguales',
                repeatNewPassword:'los campos deben ser iguales',
            }
        }else if(size(formData.newPassword)<6){
            errorsTemp={
                newPassword:'la contraseña debe tener mas de 6 caracteres',
                repeatNewPassword:'la contraseña debe tener mas de 6 caracteres'
            }
        }else{
            setIsLoading(true)
            await reAuthenticate(formData.password)
            .then(async ()=>{
                // console.log('ok')
                isSetError=false
                await firebase
                .auth()
                .currentUser.updatePassword(formData.newPassword)
                .then(()=>{
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();

                })
                .catch(()=>{
                    errorsTemp={
                        other:'error al actualizar la contraseña'
                    }
                    setIsLoading(false)
                })
            })
            .catch((err)=>{
                console.log(err)
                setIsLoading(false)
                errorsTemp={
                    password:'la contraseña no es correcta'
                }
            })
        }
        isSetError && setErrors(errorsTemp)
    }

    return(
        <View style={styles.view}>
            <Input
               placeholder='Contraseña Actual'
               style={styles.input} 
               password={true}
               secureTextEntry={!showPassword}
               rightIcon={{
                   type: 'material-community',
                   name: showPassword ? 'eye-off-outline': 'eye-outline',
                   color: '#c2c2c2',
                   onPress: ()=> setShowPassword(!showPassword)

               }}
               onChange={(e)=>onChange(e, 'password')}
               errorMessage={errors.password}
            />
            <Input
               placeholder='Nueva Contraseña'
               style={styles.input} 
               password={true}
               secureTextEntry={!showPassword}
               rightIcon={{
                   type: 'material-community',
                   name: showPassword ? 'eye-off-outline': 'eye-outline',
                   color: '#c2c2c2',
                   onPress: ()=> setShowPassword(!showPassword)

               }}
               onChange={(e)=>onChange(e, 'newPassword')}
               errorMessage={errors.newPassword}
            />
            <Input
               placeholder='Repetir nueva contraseña'
               style={styles.input} 
               password={true}
               secureTextEntry={!showPassword}
               rightIcon={{
                   type: 'material-community',
                   name: showPassword ? 'eye-off-outline': 'eye-outline',
                   color: '#c2c2c2',
                   onPress: ()=> setShowPassword(!showPassword)

               }}
               onChange={(e)=>onChange(e, 'repeatNewPassword')}
               errorMessage={errors.repeatNewPassword}
            />
            <Button
                title='Cambiar Contraseña'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />  
            <Text>{errors.other}</Text>
            
        </View>
    )
}

function defaultValue(){
    return{
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    }
}
const styles = StyleSheet.create({
    view:{
        alignItems:'center',
        paddingTop: 10,
        paddingBottom:10
    },
    input:{
        marginBottom:10
    },
    btnContainer:{
        marginTop:20,
        width:'100%'
    },
    btn:{
        backgroundColor:'#00a680'
    }
})