import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';

const db = firebase.firestore(firebaseApp);


const ListReviews = (props) => {
    const { navigation, idRestaurant, setRating } = props;
    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })
    // console.log(userLogged);
    return (
        <View>
            {userLogged ?
                <Button
                    title="comentar"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitle}
                    icon={{
                        type: 'material-community',
                        name: 'square-edit-outline',
                        color: "#00a680"
                    }}
                    onPress={() => navigation.navigate('addReview', {
                        idRestaurant: idRestaurant
                    })}
                />
                :
                <Text
                //ya que navigation se actualizo para navegar a nested screens hay que ir primero al stack y luego especificar el screen
                    onPress={() => navigation.navigate('Account', {screen:'Login'})}
                    style={{ textAlign: 'center', color: '#00a680', padding: 10 }}>Para comentar debes estar logeado{" \n"}
                    <Text style={{fontWeight:'bold'}}>Pulsa AQUÍ para iniciar sesión </Text>
                </Text>
            }
        </View>
    )
}

export default ListReviews;


const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: 'transparent'
    },
    btnTitle: {
        color: "#00a680"
    }
})