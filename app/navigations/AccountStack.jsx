import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register";


const Stack = createStackNavigator()

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AccountStack"
                component={Account}
                options={{ title: "Mi Cuenta" }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ title: "iniciar sesion" }}
            /> 
             <Stack.Screen
                name="register"
                component={Register}
                options={ {title: "registro" }}
            />
        </Stack.Navigator>
    );
}