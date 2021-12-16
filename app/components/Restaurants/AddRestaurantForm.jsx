import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'
import { Camera } from 'expo-camera';
import { size, filter, map } from 'lodash';
import MapView from 'react-native-maps';
import Modal from '../Modal';
import { useEffect } from 'react';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import "firebase/storage";
import "firebase/firestore";

import uuid from 'random-uuid-v4';


const WidthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
    const { toastRef, setIsLoading, navigation } = props;
    const [restaurantAdress, setRestaurantAdress] = useState('')
    const [restaurantDescription, setRestaurantDescription] = useState('')
    const [restaurantName, setRestaurantName] = useState('')
    const [imageSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setlocationRestaurant] = useState(null)

    const db = firebase.firestore(firebaseApp);

    const addRestaurant = () => {
        if (!restaurantName || !restaurantAdress || !restaurantDescription) {
            toastRef.current.show('todos los campos son obligatorios')
        } else if (size(imageSelected) === 0) {
            toastRef.current.show('el restaurant tiene que tener al menos una foto')
        } else if (!locationRestaurant) {
            toastRef.current.show('tienes que localizar el restaurante en el mapa')
        } else {
            setIsLoading(true)
            uploadImage().then((response) => {
                // console.log(response);
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAdress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoted: 0,
                        createdAt: new Date(),
                        createdBy: firebase.auth().currentUser.uid
                    }).then(()=>{
                        setIsLoading(false)
                        navigation.navigate("restaurantsName")
                        toastRef.current.show("Restaurante Creado exitosamente");

                        console.log('ok');
                    }).catch((err)=>{
                        console.log(err)
                        setIsLoading(false)
                        toastRef.current.show("error al subir el restaurant, intentelo mas tarde");
                    })
            });

        }
    }

    const uploadImage = async () => {
        // console.log(imageSelected);
        const imageBlob = [];
        await Promise.all(
            map(imageSelected, async image => {
                const response = await fetch(image);
                // console.log(JSON.stringify(response));
                const blob = await response.blob();
                const ref = firebase.storage().ref('restaurants').child(uuid())
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`restaurants/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoUrl) => {
                            imageBlob.push(photoUrl)
                        })
                })
            })
        )
        return imageBlob;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant
                imageRestaurant={imageSelected[0]}
            />
            <FormAdd
                setIsVisibleMap={setIsVisibleMap}
                setRestaurantAdress={setRestaurantAdress}
                setRestaurantDescription={setRestaurantDescription}
                setRestaurantName={setRestaurantName}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}

            />
            <Button
                title="crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnRestaurant}
            />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
                toastRef={toastRef}
                setlocationRestaurant={setlocationRestaurant}
            />
        </ScrollView>
    )
}

function FormAdd(props) {
    const { locationRestaurant, setIsVisibleMap, setRestaurantAdress, setRestaurantDescription, setRestaurantName } = props
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder='nombre del restaurante'
                style={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder='direccion'
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAdress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}

            />
            <Input
                placeholder='descripcion del restaurante'
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props) {
    const {
        isVisibleMap,
        setIsVisibleMap,
        setlocationRestaurant,
        toastRef
    } = props;
    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            const resultPermissions = await Location.requestForegroundPermissionsAsync()

            if (resultPermissions.status !== 'granted') {
                console.log('not granted');
                toastRef.current.show(
                    "para crear restaurantes debes primero aceptar los permisos",
                    3000
                )
            } else {
                //TODO change to getCurrentPositionAsync
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                });
            }
        })()
    }, [])

    const confirmLocation = () => {
        setlocationRestaurant(location);
        setIsVisibleMap(false),
            toastRef.current.show("localización guardada correctamente")
    }
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            {location
                ?
                <><MapView
                    initialRegion={location}
                    style={styles.mapStyle}
                    showsUserLocation={true}
                    onRegionChange={(region) => {
                        setLocation(region)
                    }}
                >

                    <MapView.Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude
                        }}
                        draggable
                    />
                </MapView>
                    <View style={styles.viewMapBtn}>
                        <Button
                            title="Guardar Ubicación"
                            containerStyle={styles.viewMapBtnContainerSave}
                            buttonStyle={styles.viewMapBtnSave}
                            onPress={confirmLocation}
                        />
                        <Button
                            title="Cancelar"
                            containerStyle={styles.viewMapBtnContainerCancel}
                            buttonStyle={styles.viewMapBtnCancel}
                            onPress={() => setIsVisibleMap(false)}
                        />
                    </View>
                </>
                :
                <Text>Mapa no ha cargado</Text>
            }
        </Modal>
    )
}

function ImageRestaurant(props) {
    const { imageRestaurant } = props;
    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageRestaurant
                        ?
                        { uri: imageRestaurant }
                        :
                        require('../../../assets/img/no-image.png')
                }
                style={{ width: WidthScreen, height: 200 }}
            />

        </View>
    )
}

function UploadImage(props) {
    const { imageSelected, setImageSelected, toastRef } = props;
    const imageSelect = async () => {
        const resultPermissionsCamera = await Camera.requestPermissionsAsync()
        if (resultPermissionsCamera.granted === 'denied') {
            toastRef.current.show("hay que aceptar los permisos de la galeria",
                3000)
        } else {
            //inicio la galeria para elegir una imagen de relacion 4,3
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (result.cancelled) {
                toastRef.current.show("No has seleccionado ninguna imagen",
                    2000)
            } else {

                setImageSelected([...imageSelected, result.uri])
            }
        }
    }
    const removeImage = (image) => {
        Alert.alert(
            "Eliminar imagen",
            "Estas seguro que deseas borrar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "eliminar",
                    onPress: () => {
                        setImageSelected(filter(imageSelected, (imageUrl) => imageUrl !== image))
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.viewImage}>
            {size(imageSelected) < 4 && (


                <Icon
                    type="material-community"
                    name="camera"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {imageSelected.map((image, index) => {
                return (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: image }}
                        onPress={() => removeImage(image)}
                    />
                )
            })}
        </View>
    )
}
const styles = StyleSheet.create({
    scrollView: {
        height: '100%'
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        marginBottom: 10
    },
    btnRestaurant: {
        backgroundColor: "#00a680",
        margin: 20,
    },
    viewImage: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3'
    },
    miniatureStyle: {

        marginRight: 10,
        height: 70,
        width: 70,
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})