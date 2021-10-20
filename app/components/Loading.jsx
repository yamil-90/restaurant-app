import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";
import { Modal } from "react-native";

export default function Loading(props) {
    const { isVisible, text } = props

    return (
        <Overlay
        isVisible={isVisible}
        ModalComponent={Modal} 
            overlayStyle={styles.overlay
            }>
            <View style={styles.view}>
                <ActivityIndicator size="large" color="#00a680" />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        height: 100,
        width: 200,
        backgroundColor: "#fff",
        borderColor: "#00a680",
        borderWidth: 2,
        borderRadius: 10
    },
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "#228b22",
        textTransform: "uppercase",
        marginTop: 10
    }
});