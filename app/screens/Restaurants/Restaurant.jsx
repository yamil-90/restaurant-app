import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Icon, ListItem, Rating } from 'react-native-elements';
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import 'firebase/firestore';
import Loading from '../../components/Loading';
import CarouselImage from '../../components/CarouselImage';
import Map from '../../components/Map';
import { map } from 'lodash';
import ListReviews from '../../components/Restaurants/ListReviews';

// iniciamos la base de datos
const db = firebase.firestore(firebaseApp)

const screenWidth = Dimensions.get('window').width;

const Restaurant = (props) => {
    const { route, navigation } = props;
    const { id, name, } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [rating, setRating] = useState(4)

    useEffect(() => {
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
    if (!restaurant) return <Loading setIsVisible={true} text="cargando" />
    return (
        <ScrollView>
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
                setRating={setRating}
                idRestaurant={restaurant.id}
                navigation={navigation}
            />

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
                    tintColor='#f2f2f2'
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
                height={200}
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
})