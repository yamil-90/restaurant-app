import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Favorites from "../screens/Favorites";
import { StackActions } from "@react-navigation/routers";

const Stack =  createStackNavigator() 

export default function FavoritesStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="favoritesStack"
                component={Favorites}
                options={{title:"Restaurantes Favoritos"}}
             />
        </Stack.Navigator>
    )
}