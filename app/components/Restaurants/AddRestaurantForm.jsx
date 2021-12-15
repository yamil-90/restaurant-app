import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { size, filter } from 'lodash';
import Modal from '../Modal';

const WidthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
    const { toastRef, setIsloading, navigation } = props;
    const [restaurantAdress, setRestaurantAdress] = useState('')
    const [restaurantDescription, setRestaurantDescription] = useState('')
    const [restaurantName, setRestaurantName] = useState('')
    const [imageSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)

    const addRestaurant = () => {
        console.log('submit')
        // console.log(restaurantAdress);
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
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap}/>
        </ScrollView>
    )
}

function FormAdd(props) {
    const {setIsVisibleMap, setRestaurantAdress, setRestaurantDescription, setRestaurantName } = props
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
                    color:"#c2c2c2",
                    onPress: ()=>setIsVisibleMap(true)
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

function Map(props){
    const {isVisibleMap, setIsVisibleMap}=props;

    return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <Text>mapa</Text>
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
    }
})