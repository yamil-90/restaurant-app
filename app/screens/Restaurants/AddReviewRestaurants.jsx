import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);



const AddReviewRestaurants = (props) => {
    const { navigation, route } = props;
    const { idRestaurant } = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addReview = () => {
        if (!rating) {
            toastRef.current.show('debes colocar una puntuacion')
        } else if (!title) {
            toastRef.current.show('El titulo es obligatorio')
        } else if (!review) {
            toastRef.current.show('El comentario es obligatorio')
        } else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createdAt: new Date(),
              };
            db.collection("reviews")
                .add(payload)
                .then(() => {
                    // setIsLoading(false);
                    updateRestaurant()
                })
                .catch((er) => {
                    console.log('error is',er);
                    setIsLoading(false)
                    toastRef.current.show('error al subir los datos')

                });

        }
    };

    const updateRestaurant =()=>{
        const restaurantRef = db.collection('restaurants').doc(idRestaurant);
        // console.log(idRestaurant);
        restaurantRef.get().then((response)=>{
            const restaurantData= response.data();
            // console.log(response)
            const ratingTotal = restaurantData.ratingTotal + rating;
            const quantityVoted = restaurantData.quantityVoted +1;
            const ratingResult = ratingTotal/quantityVoted;

            restaurantRef
            .update({
                rating : ratingResult,
                ratingTotal,
                quantityVoted
            })
            .then(()=>{
                setIsLoading(false)
                navigation.goBack();
            })
            .catch((er)=>{
                console.log('error is',err);
            });
        });
    };
    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={['Terrible', 'Malo', 'Regular', 'Bueno', 'Sobresaliente']}
                    size={35}
                    defaultRating={0}
                    onFinishRating={(value) => { setRating(value) }}

                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder='Titulo'
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder='Comentario'
                    multiline={true}
                    inputContainerStyle={styles.textArea}

                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button
                    title="Enviar Comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast
                ref={toastRef}
                position='center'
                opacity={0.9}
            />
            <Loading
                isVisible={isLoading}
                text={'Enviando comentario'}
            />
        </View>
    )
}

export default AddReviewRestaurants

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 200,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        marginTop: 15
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '95%'
    },
    btn: {
        backgroundColor: '#00a680'
    }

})
