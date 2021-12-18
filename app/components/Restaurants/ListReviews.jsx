import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';
import { map } from 'lodash';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import { useEffect } from 'react';

const db = firebase.firestore(firebaseApp);


const ListReviews = (props) => {
    const { navigation, idRestaurant } = props;
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([])

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useEffect(()=>{
        
        db.collection('reviews')
        .where('idRestaurant', '==', idRestaurant)
        .get()
        .then((response)=>{
            const resultReview= [];

            response.forEach(doc=>{
                const data =doc.data();
                data.id = doc.id
                resultReview.push(data)
            })
            setReviews(resultReview)
        })
    },[])
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
            {
                map(reviews, (review, index)=>{
                    return <Review key={index} review={review}/>
                })
            }
        </View>
    )
}

function Review(props){
    const {title, review, rating, createdAt, avatarUser}=props.review;
    const createReview = new Date(createdAt.seconds*1000)
    // console.log('review es',props);
    return (
        <View style={styles.viewReview}>
            <View style={styles.imageAvatar}>
                <Avatar
                rounded
                size="large"
                containerStyle={styles.imageAvatarUser}
                source={avatarUser?{uri:avatarUser}:require('../../../assets/img/avatar-default.jpg')}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating
                startingValue={rating}
                readOnly
                imageSize={10}
                />
                <Text style={styles.reviewDate}>{createReview.getDate()}/{createReview.getMonth()+1}/{createReview.getFullYear()}</Text>
            </View>

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
    },
    viewReview:{
        flexDirection:'row',
        padding:10,
        paddingBottom:20,
        borderBottomColor:'gray',
        borderBottomWidth:1
    },
    imageAvatar:{
        marginRight:15
    },
    imageAvatarUser:{
        height:50,
        width:50
    },
    viewInfo:{
        flex: 1,
        alignItems:'flex-start'
    },
    reviewTitle:{
        fontWeight:'bold'
    },
    reviewText:{
        paddingTop: 2,
        color: 'gray',
        marginBottom:5
    },
    reviewDate:{
        marginTop:2,
        position:'absolute',
        right:0,
        bottom:0,
        fontSize:12,
        color:'grey'
    }
})