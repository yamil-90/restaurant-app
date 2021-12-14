import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem } from "react-native-elements";
import { Icon } from "react-native-elements/dist/icons/Icon";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props) {
    const { toastRef, userInfo, setuserInfo, setReloadUserInfo } = props;
    const [renderComponent, setRenderComponent] = useState(null)
    const [showModal, setShowModal] = useState(false);


    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setuserInfo={setuserInfo}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setShowModal(true)
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm 
                    email={userInfo.email}
                        setuserInfo={setuserInfo}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                        />
                )
                setShowModal(true)
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                    setShowModal={setShowModal}
                    toastRef={toastRef}                    
                    />
                )
                setShowModal(true)
                break;


            default:
                setRenderComponent(null)
                setShowModal(false)
                break;
        }
    }
    const menuOptions = generateOptions(selectedComponent)


    return (
        <View>
            {menuOptions.map((menu, index) => (

                <ListItem
                    key={index}
                    bottomDivider
                    onPress={menu.onPress}
                >
                    <Icon color={menu.iconColor} type={menu.iconType} name={menu.iconName} />
                    <ListItem.Content>
                        <ListItem.Title>{menu.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron style={{ fontSize: "large" }} />
                </ListItem>

            ))}
            {renderComponent && <Modal isVisible={showModal} setIsVisible={setShowModal}>
                {renderComponent}
            </Modal>}
        </View>
    )
}


function generateOptions(selectedComponent) {
    return [
        {
            title: "Cambiar nombre y apellidos",
            iconName: "account-circle",
            iconType: "material-community",
            iconColor: "#ccc",
            onPress: () => selectedComponent("displayName"),
        },
        {
            title: "Cambiar email",
            iconName: "at",
            iconType: "material-community",
            iconColor: "#ccc",
            onPress: () => selectedComponent("email"),
        },
        {
            title: "Cambiar Contraseña",
            iconName: "lock-reset",
            iconType: "material-community",
            iconColor: "#ccc",
            onPress: () => selectedComponent("password"),
        }
    ]
}

const styles = StyleSheet.create({

})