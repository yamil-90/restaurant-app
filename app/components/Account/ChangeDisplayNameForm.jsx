import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';

export default function ChangeDisplayNameForm(props){
    const {toastRef, displayName, setShowModal} = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null)

    //cuando presionamos el boton se cambia el displayName y valido la info
    const onSubmit=()=>{
        setError(null);
        if(!newDisplayName){
            setError('El nombre no puede estar vacio')
        }else if (newDisplayName=== displayName){
            setError('el nombre no puede ser igual al anterior')
        }else{
            console.log('ok')
        }
    }
    return(
        <View style={Styles.view}>
            
            <Input type="text" 
                placeholder='Nombre y apellido'
                containerStyle={Styles.input}
                rightIcon={{
                    type: 'material-community',
                    name: 'account-circle-outline',
                    color: '#c2c2c2'
                }}
                defaultValue={displayName || ''}
                onChange={e => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
                //aca se actualiza automaticamente el nombre
            />
            
            <Button
                title='Cambiar Nombre'
                containerStyle={Styles.btnContainer}
                buttonStyle={Styles.btn}
                onPress={onSubmit}

            />            

        </View>
    )
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
        marginBottom: 20
    },
    btnContainer:{
        marginTop: 10,
        width: '95%'
    },
    btn:{
        backgroundColor:'#00a680'
    }
})