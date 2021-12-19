import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { size } from "lodash";
import Toast from "react-native-easy-toast";
import { useNavigationState } from '@react-navigation/native';

import Loading from "../components/Loading";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp)

export default function Favorites(props) {
    const { navigation } = props;
    const [restaurants, setRestaurants] = useState(null);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(
            () => {
                if (userLogged) {
                    const idUser = firebase.auth().currentUser.uid
                    const idRestaurantArray = [];
                    db.collection('favorites')
                        .where('idUser', '==', idUser)
                        .get()
                        .then((response) => {
                            response.forEach((doc) => {
                                idRestaurantArray.push(doc.data().idRestaurant);
                            })

                            getDataRestaurant(idRestaurantArray).then((response) => {
                                const restaurantsDataArray = [];
                                response.forEach((doc) => {
                                    const restaurant = doc.data();
                                    restaurant.id = doc.id
                                    restaurantsDataArray.push(restaurant)
                                })
                                setRestaurants(restaurantsDataArray)

                            })
                        }).catch((er) => {
                            console.log('error is ', er);

                        })

                    setReloadData(false)
                }
            }, [userLogged, reloadData],

        )
    )
    const getDataRestaurant = (idRestaurantArray) => {
        const arrayRestaurants = [];
        idRestaurantArray.forEach(idRestaurant => {
            const result = db.collection('restaurants').doc(idRestaurant).get()
            arrayRestaurants.push(result)
        });

        return Promise.all(arrayRestaurants);
    }
    if (!userLogged) {
        return <UserNotLogged navigation={navigation} />
    }
    if (!restaurants) {
        return <Loading isVisible={true} text="Cargando restaurantes" />
    } else if (size(restaurants) == 0) {
        return <NotFoundRestaurants />
    }


    return (
        <View style={styles.view}>
            <FlatList
                data={restaurants}
                renderItem={(restaurant) => {
                    return (
                        <Restaurant
                            navigation={navigation}
                            setReloadData={setReloadData}
                            setIsLoading={setIsLoading}
                            toastRef={toastRef}
                            restaurant={restaurant}
                        />
                    )
                }}
                keyExtractor={(item, index) => index.toString()}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} />
        </View>
    )
}

function Restaurant(props) {
    const { restaurant, setIsLoading, toastRef, setReloadData, navigation } = props;
    const { name, images, id } = restaurant.item;
    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar de favoritos",
            'Estas seguro que deseas borrar este restaurant de favoritos?',
            [
                {
                    text: 'cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Remover',
                    onPress: removeFavorite
                }
            ]
        )
    }
    const removeFavorite = () => {
        
        setIsLoading(true)
        db.collection('favorites')
            .where('idRestaurant', '==', id)
            .where('idUser', '==', firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const idFavorite = doc.id;
                    db.collection('favorites')
                        .doc(idFavorite)
                        .delete()
                        .then(() => {
                            setIsLoading(false)
                            // console.log('eliminado')
                            toastRef.current.show('Restaurante Eliminado')
                            setReloadData(true)

                        }).catch((err) => {
                            console.log('errores', err);
                            setIsLoading(false)
                            toastRef.current.show('error al eliminar el restaurante')

                        })
                })
            })
    }
    const index = useRef(useNavigationState(state => state.index))
    return (
        <View style={styles.restaurantView}>
            <TouchableOpacity onPress={() => {
                console.log(index)
                 if(index.current!==0) navigation.popToTop()
                 navigation.navigate('RestaurantsStack', {
                    screen:'Restaurant',
                    params:{id},})
                }}>
                <Image
                    style={styles.image}
                    resizeMode='cover'
                    PlaceholderContent={<ActivityIndicator color='#00a680' />}
                    source={
                        images[0] ?
                            { uri: images[0] } :
                            require('../../assets/img/no-image.png')
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>
                        {name}
                    </Text>
                    <Icon
                        type='material-community'
                        name='heart'
                        color='#f00'
                        containerStyle={styles.favoriteIcon}
                        onPress={confirmRemoveFavorite}
                        underlayColor='transparent'
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

function NotFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon
                type='material-community'
                name='alert-outline'
                size={50}
                color='#f00'
            />
            <Text>No tienes Favoritos, agrega algunos!</Text>
        </View>
    )
}
function UserNotLogged(props) {
    const { navigation } = props;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon
                type='material-community'
                name='alert-outline'
                size={30}

            />
            <Text>Necesitas estar logueado para acceder a esta sección</Text>
            <Button
                title='Ir al login'
                containerStyle={{ marginTop: 20, width: '80%' }}
                buttonStyle={{ backgroundColor: '#00a680' }}
                onPress={() => navigation.navigate('Account', { screen: 'Login' })}

            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    restaurantView: {
        margin: 10
    },
    image: {
        width: '100%',
        height: 180
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff",
    },
    name: {
        fontWeight: 'bold',
        fontSize: 25
    },
    favoriteIcon: {
        marginTop: -35,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 100
    }
})