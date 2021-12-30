import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import AccountStack from "./AccountStack";
import SearchStack from "./SearchStack";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { Button } from "react-native";


const Tab = createBottomTabNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="RestaurantsStack"
                screenOptions={

                    ({ route }) => ({
                        tabBarIcon: ({ color }) => ScreenOptions(route, color),
                        tabBarInactiveTintColor: "#646464",
                        tabBarActiveTintColor: "#00a680",
                        tabBarStyle: [
                            {
                              "display": "flex"
                            },
                            null
                          ],
                          
                    })
                    
                }
            >
                <Tab.Screen name="RestaurantsStack"
                    component={RestaurantsStack}
                    options={{
                        headerShown: false,
                        title: "Restaurantes"
                    }} />
                <Tab.Screen name="Favorites"
                    component={FavoritesStack}
                    options={{
                        headerShown: false,
                        title: "Favoritos",
                    }} />
                <Tab.Screen name="TopRestaurants"
                    component={TopRestaurantsStack}
                    options={{
                        headerShown: false,
                        title: "Top 5"
                    }} />
                <Tab.Screen name="Search"
                    component={SearchStack}
                    options={{
                        headerShown: false,
                        title: "Buscar"
                    }} />
                <Tab.Screen name="Account"
                    component={AccountStack}
                    options={{
                        headerShown: false,
                        title: "Cuenta"
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function ScreenOptions(route, color) {
    let iconName;
    switch (route.name) {
        case "RestaurantsStack":
            iconName = "compass-outline"
            break;
        case "Favorites":
            iconName = "heart-outline"
            break;
        case "TopRestaurants":
            iconName = "star-outline"
            break;
        case "Search":
            iconName = "magnify"
            break;
        case "Account":
            iconName = "account-outline"
            break;
        default:
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}