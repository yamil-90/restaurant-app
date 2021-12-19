import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, Text, View, FlatList,TouchableOpacity } from 'react-native'
import { Card, Image, Icon, Rating } from 'react-native-elements';
import { useNavigationState } from '@react-navigation/native';
const ListTopRestaurants = (props) => {
    const {navigation, restaurants}=props;
    // const [state, setstate] = useState()

    return (
        <FlatList
            data={restaurants}
            renderItem={(restaurant)=>{
                return <Restaurants restaurant={restaurant} navigation={navigation} />
            }}
            keyExtractor={(item, index)=>index.toString()}
        />
    )
}
const Restaurants =(props)=>{
    const {navigation, restaurant}=props;
    const {name, rating, images, description, id}= restaurant.item;
    const [iconColor, setIconColor] = useState('#000');

    useEffect(() => {
        switch (restaurant.index) {
            case 0:
                setIconColor('#efb819')
                break;
            case 1:
                setIconColor('#e3e4e5')
                break;
                case 2:
                    setIconColor('#cd7f32')
            default:
                break;
        }
    }, [])
    const index = useRef(useNavigationState(state => state.index))

    return(
        <TouchableOpacity
        onPress={()=>{
            if(index.current!==0) navigation.popToTop()
                 navigation.navigate('RestaurantsStack', {
                    screen:'Restaurant',
                    params:{id},})
        }}
        >
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name='chess-queen'
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image
                style={styles.restaurantImage}
                resizeMode='cover'
                source={
                    images[0]?
                    {uri:images[0]}:
                    require('../../../assets/img/no-image.png')
                }
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating 
                    imageSize={20}
                    startingValue={rating}
                    readOnly
                    />
                </View>
                    <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

export default ListTopRestaurants

const styles = StyleSheet.create({
    containerCard:{
        marginBottom:30,
        borderWidth:0
    },
    containerIcon:{
        position: 'absolute',
        top:-30,
        left:-30,
        zIndex:2
    },
    restaurantImage:{
        width:'100%',
        height:150
    },
    titleRating:{
       flexDirection:'row',
       marginTop:10 ,
       justifyContent:'space-between'
    },
    title: {
        fontWeight:'bold',
        fontSize:20
    },
    description:{
        color:'grey',
        marginTop: 0,
        textAlign:'justify'
    }
})
