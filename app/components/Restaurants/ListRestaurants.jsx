import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements';
import { size } from 'lodash';
import { useNavigation } from '@react-navigation/native';

export default function ListRestaurants(props) {
    const { restaurants, handleLoadMore, isLoading } = props;
    const navigation = useNavigation();
    return (
        <View>
            {size(restaurants) > 0
                ?
                <FlatList
                    data={restaurants}
                    keyExtractor={(element, index) => index.toString()}
                    renderItem={(restaurant) => <Restaurant navigation={navigation} restaurant={restaurant} />}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading}/>}
                />
                :
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator color="#00a680" size="large" />
                    <Text>Cargando Restaurantes</Text>
                </View>
            }

        </View>
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const {id, images, name, description, address } = restaurant.item

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Restaurant', {
                id,
                name
                //en las nuevas versiones de js toma el nombre como key y el valor como valor
            })}>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image
                        source={
                            images[0]
                                ? { uri: images[0] }
                                : require('../../../assets/img/no-image.png')
                        }
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff" />}
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList(props) {
    const { isLoading } = props;
    if (isLoading) {
        return (
            <View style={styles.loadingRestaurants}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
    <View style={styles.notFoundRestaurants}>
        <Text>No quedan restaurantes por cargar</Text>
    </View>
)
    }
}

const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    viewRestaurant: {
        flexDirection: 'row',
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15
    },
    imageRestaurant: {
        height: 80,
        width: 80
    },
    restaurantName: {
        fontWeight: 'bold'
    },
    restaurantAddress: {
        paddingTop: 2,
        color: 'grey'
    },
    restaurantDescription: {
        paddingTop: 2,
        color: 'grey',
        width: 300
    },
    loadingRestaurants:{
        marginTop:10,
        marginBottom:20,
        alignItems:'center'
    },
    notFoundRestaurants:{
        marginTop:10,
        marginBottom:20,
        alignItems:'center'
    }

})
