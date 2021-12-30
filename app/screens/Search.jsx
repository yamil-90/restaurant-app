import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Flatlist, Image } from 'react-native'
import { ListItem, Icon, SearchBar, Avatar } from 'react-native-elements'
import { useNavigationState, NavigationState } from '@react-navigation/native';

import { FireSQL } from "firesql";
import firebase from "firebase/app";
import { FlatList } from 'react-native-gesture-handler';

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });


const Search = (props) => {
    const index = useRef(useNavigationState(state => state.index))
    const { navigation } = props;
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([])

    // console.log(search);
    useEffect(() => {
        if (search) {
            fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
                .then((response) => {
                    setRestaurants(response);
                    // console.log(response);

                })
        }
        
    }, [search])
    
    return (
        <View>
            <SearchBar
                placeholder='Buscar restaurante...'
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar}
            />
            {restaurants.length === 0 ? (
                <NotFoundResult />
            ) :
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant index={index} restaurant={restaurant} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                />

            }
        </View>
    )
}

const NotFoundResult = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
                source={(require('../../assets/img/no-result-found.png'))}
                resizeMode='cover'
                style={{ width: 200, height: 200 }}
            />
        </View>)
}
const Restaurant = (props) => {
    const { restaurant, navigation, index } = props;
    const { name, id, images } = restaurant.item;

    console.log('navigationstateindex',useNavigationState(state=>state))
    return (
        <ListItem
            onPress={() => {
                
                navigation.popToTop();
                navigation.navigate('RestaurantsStack', {
                    screen:'Restaurant',
                    params:{id, name},})
            }}
        >
            <Avatar
                source={images[0] ?
                    { uri: images[0] } :
                    require('../../assets/img/no-image.png')}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron size={30} color='#000' />
        </ListItem>
    )

}

export default Search;


const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20
    }
})

