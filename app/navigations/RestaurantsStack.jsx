import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurants from "../screens/Restaurants/AddRestaurants";
import Restaurant from "../screens/Restaurants/Restaurant";
import addReviewRestaurants from "../screens/Restaurants/AddReviewRestaurants"


const Stack = createStackNavigator();

export default function RestaurantsStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="restaurantsName"
            component={Restaurants}
            options={{title:"Restaurantes"}}
            />
            <Stack.Screen 
            name="addRestaurant"
            component={AddRestaurants}
            options={{title:"agregar restaurante"}}
            />
            <Stack.Screen 
            name="Restaurant"
            component={Restaurant}
            />
            <Stack.Screen 
            name="addReview"
            component={addReviewRestaurants}
            options={{title:"agregar review"}}
            />
        </Stack.Navigator>
    )
}