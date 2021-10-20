import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { Icon } from "react-native-elements/dist/icons/Icon";


export default function AccountOptions(props) {
    const { toastRef, userInfo } = props;
    const menuOptions = generateOptions()


    return (
        <View>
            {menuOptions.map((menu, index) => (
                
                <ListItem
                    key={index}
                    bottomDivider
                >
                    <Icon name={menu.iconName}/>
                    <ListItem.Content>
                        <ListItem.Title>{menu.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                
            ))}
        </View>
    )
}

function generateOptions() {
    return [
        {
            title: "Cambiar nombre y apellidos",
            iconName: "rowing"
        },
        {
            title: "Cambiar email",
        },
        {
            title: "Cambiar Contraseña",
        }
    ]
}

const styles = StyleSheet.create({

})