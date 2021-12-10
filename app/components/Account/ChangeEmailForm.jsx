import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import {validateEmail} from '../../utils/validations';
import {reAuthenticate} from '../../utils/api';

export default function ChangeEmailForm(props){
    const {toastRef, email, setShowModal, setReloadUserInfo} = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData]=useState(defaultFormValue())
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)
  
    const onChange=(e, type)=>{
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    //cuando presionamos el boton se cambia el email y valido la info
    const onSubmit=()=>{
        setErrors({});
        if(!formData.email || email===formData.email){
            console.log(formData);
            setErrors({
                email:'el email no debe ser el mismo'
            })
        } else if(!validateEmail(formData.email)){
            setErrors({
                email:'email incorrecto'
            })
        } else if (!formData.password){
            setErrors({
                password:'ingrese contraseña correcta'
            })
        } else {
            setIsLoading(true)
            //para cambiar info sensible en firebase tengo que reautentificar primero
            reAuthenticate(formData.password)
            .then(response=>{
                firebase.auth()
                .currentUser.updateEmail(formData.email)
                .then(()=>{
                    setIsLoading(false);
                    setReloadUserInfo(true);
                    toastRef.current.show('email actualizado exitosamente');
                    setShowModal(false);
                })
                // console.log(response);
            }).catch((err)=>{
                console.log(err);
                setIsLoading(false);
                setErrors({password: 'la contraseña no es correcta'})
            })
        }
    }

    
    return(
        <View style={Styles.view}>
            
            <Input type="email" 
                placeholder='Email'
                containerStyle={Styles.input}
                rightIcon={{
                    type: 'material-community',
                    name: 'at',
                    color: '#c2c2c2'
                }}
                defaultValue={email || ''}
                onChange={(e)=>onChange(e, 'email')}
                errorMessage={errors.email}
                //aca se actualiza automaticamente el email
            />
            <Input type="password" 
                placeholder='Contraseña'
                containerStyle={Styles.input}
                rightIcon={{
                    type: 'material-community',
                    name: showPassword ? 'eye-off-outline': 'eye-outline',
                    color: '#c2c2c2',
                    onPress: ()=> setShowPassword(!showPassword)
                    
                }}
                
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e)=>onChange(e, 'password')}
                errorMessage={errors.password}
                //aca se actualiza automaticamente el nombre
            />
            <Button
                title='Cambiar Email'
                containerStyle={Styles.btnContainer}
                buttonStyle={Styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />            

        </View>
    )
}

const defaultFormValue=()=>{
    return {
        email:"",
        password:""
    }
}


const Styles = StyleSheet.create({
    view:{
        alignItems:"center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input:{
        marginBottom:10
    },
    btnContainer:{
        marginBottom: 10
    },
    btnContainer:{
        marginTop: 10,
        width: '95%'
    },
    btn:{
        backgroundColor:'#00a680'
    }
})