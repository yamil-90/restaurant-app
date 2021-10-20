import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from "firebase"
import { Camera } from 'expo-camera';

export default function InfoUser(props) {
    const { userInfo: { uid, photoURL, displayName, email },
        toastRef, setLoading, setLoadingText
    } = props;
    const changeAvatar = async () => {
        const resultPermissionsCamera = await Camera.requestPermissionsAsync()
        if (!resultPermissionsCamera.granted) {
            toastRef.current.show("hay que aceptar lo permisos de la galeria")
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowEditing: true,
                aspect: [4, 3]
            })
            if (result.cancelled == true) {
                toastRef.current.show("no se ha seleccionado ninguna imagen")
            } else {
                uploadImage(result.uri).then(() => {
                    updatePhotoURL()
                    toastRef.current.show("imagen subida");
                }).catch(() => {
                    toastRef.current.show("error al subir la imagen");
                })
            }
        }
    }
    const uploadImage = async (uri) => {
        setLoadingText("actualizando avatar")
        setLoading(true)
        const response = await fetch(uri);
        const blob = await response.blob()
        const reference = firebase.storage().ref(`/avatar/${uid}`)
        return reference.put(blob)
    }

    const updatePhotoURL = () => {
        firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async result => {
                const update = {
                    photoURL: result
                };
                await firebase.auth().currentUser.updateProfile(update);
                setLoading(false)
            }).catch(() => {
                setLoading(false)
                toastRef.current.show("error al subir la imagen");
            })
    }
    return (


        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                containerStyle={styles.avatarUserInfo}
                source={
                    photoURL
                        ? { uri: photoURL }
                        : require("../../../assets/img/avatar-default.jpg")}
            >
                <Avatar.Accessory onPress={changeAvatar} />
            </Avatar>
            <View>
                <Text style={styles.displayName} >
                    {displayName ? displayName : "name undefined"}
                </Text>
                <Text>
                    {email ? email : "email undefined"}
                </Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
        marginRight: 5
    },
    avatarUserInfo: {
        marginRight: 5

    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    },
    accesoryStyle: {
        height: "10"
    }
})