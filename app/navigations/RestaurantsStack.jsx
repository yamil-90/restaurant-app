import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurants from "../screens/Restaurants/AddRestaurants";
import Restaurant from "../screens/Restaurants/Restaurant";

const Stack = createStackNavigator();

export default function RestaurantsStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="restaurantsName"
            component={Restaurants}
            options={{title:"Restautantes"}}
            />
            <Stack.Screen 
            name="addRestaurant"
            component={AddRestaurants}
            options={{title:"agregar restautante"}}
            />
            <Stack.Screen 
            name="Restaurant"
            component={Restaurant}
            />
        </Stack.Navigator>
    )
}