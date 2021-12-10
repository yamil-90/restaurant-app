import React from 'react';
import { StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';

export default function Modal(props) {
    const { isVisible, setIsVisible, children } = props;

    const closeModal=() => setIsVisible(false);
    return (
        <Overlay
        onBackdropPress={()=>closeModal}
            isVisible={isVisible}
            fullScreen={false}
            overlayStyle={styles.overlay}
            onBackdropPress={closeModal}
        >
            {children}
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay:{
        height:"auto",
        width:"90%",
        backgroundColor: "#fff",
    }
})