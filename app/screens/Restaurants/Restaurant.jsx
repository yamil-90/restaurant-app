import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Icon, ListItem, Rating } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import 'firebase/firestore';
import Loading from '../../components/Loading';
import CarouselImage from '../../components/CarouselImage';
import Map from '../../components/Map';
import { map } from 'lodash';
import ListReviews from '../../components/Restaurants/ListReviews';
import Toast from 'react-native-easy-toast';

// iniciamos la base de datos
const db = firebase.firestore(firebaseApp)

const screenWidth = Dimensions.get('window').width;

const Restaurant = (props) => {
    const { route, navigation } = props;
    const { id, name, } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [rating, setRating] = useState(4);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();
    const [isFavorite, setIsFavorite] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)

    })
    useFocusEffect(
        useCallback(() => {
            const { navigation } = props;
            navigation.setOptions({
                title: route.params.name
            })
            db.collection('restaurants')
                .doc(id)
                .get()
                .then((response) => {
                    const data = response.data();
                    data.id = response.id;
                    setRestaurant(data)
                    setRating(data.rating)
                })
        }, [])
    )

    useEffect(() => {
        if (userLogged && restaurant) {
            db.collection('favorites')
                .where('idRestaurant', '==', restaurant.id)
                .where('idUser', '==', firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    if (response.docs.length > 0) {
                        setIsFavorite(true)
                    };
                })
        }

    }, [userLogged, restaurant])

    const toggleFavorites = () => {
        if (!userLogged) {
            toastRef.current.show('debes loguearte primero')
        } else {
            if (isFavorite) {
                db.collection('favorites')
                    .where('idRestaurant', '==', restaurant.id)
                    .where('idUser', '==', firebase.auth().currentUser.uid)
                    .get()
                    .then((response)=>{
                        response.forEach((doc)=>{
                            const idFavorite = doc.id;
                            db.collection('favorites')
                            .doc(idFavorite)
                            .delete()
                            .then(()=>{
                                setIsFavorite(false);
                                toastRef.current.show('quitado de favoritos')
                            })
                            .catch((err)=>{
                                console.log(err);
                                toastRef.current.show('error, intentelo mas tarde')

                            })
                        })
                    })
            } else {
                console.log('meter en favorito')
                const payLoad = {
                    idUser: firebase.auth().currentUser.uid,
                    idRestaurant: restaurant.id
                }
                db.collection('favorites')
                    .add(payLoad)
                    .then(() => {
                        setIsFavorite(true);
                        toastRef.current.show('añadido a favoritos')
                    })
                    .catch((er) => {
                        console.log('error es', er);
                        toastRef.current.show('error al añadir a favoritos');
                    })
            }
        }
    }

    if (!restaurant) return <Loading setIsVisible={true} text="cargando" />
    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={toggleFavorites}
                    size={35}
                    underlayColor='transparent'
                    color={isFavorite ? "#f00" : "#000"}

                />
            </View>
            <CarouselImage
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReviews
                idRestaurant={restaurant.id}
                navigation={navigation}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />

        </ScrollView>
    )
}
function TitleRestaurant(props) {
    const { name, description, rating } = props;

    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <View>
                <Text style={styles.descriptionRestaurant}>
                    {description}
                </Text>
            </View>
        </View>
    )
}

function RestaurantInfo(props) {
    const { location, name, address } = props;
    const listInfo = [
        {
            text: address,
            iconName: 'map-marker',
            iconType: 'material-community',
            action: null
        }
    ]
    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>Información del restaurante</Text>
            <Map
                location={location}
                height={150}
            />
            {map(listInfo, (item, index) => {
                return (
                    <ListItem key={index}>
                        <Icon

                            name={item.iconName}
                            type={item.iconType}
                            color={'#00a680'}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                )


            })}
        </View>
    )
}
export default Restaurant

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: '#fff'
    },
    viewRestaurantTitle: {
        padding: 15
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: 'grey'
    },
    rating: {
        position: 'absolute',
        right: 0
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10

    },
    containerListItem: {
        borderBottomColor: '#b8b8b8',
        borderBottomWidth: 1,
    },
    viewFavorite: {
        position: 'absolute',
        zIndex: 10,
        right: 0,
        backgroundColor: '#fff',
        padding: 5,
        paddingLeft: 15,
        borderBottomLeftRadius: 40
    }
})