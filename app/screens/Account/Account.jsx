import React, { useState, useEffect } from "react";
import UserLogged from "./UserLogged";
import UserGuest from "./UserGuest";
import Loading from "../../components/Loading";

import firebase from 'firebase/app';
import 'firebase/database';
import "firebase/auth"

import { Text } from "react-native";


export default function Account() {
    const [login, setLogin] = useState(null);
    
    
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            !user ? setLogin(false) : setLogin(true);            
        })
        return () => {
            
        }
    }, [])
    if (login === null) return (<Loading isVisible={true} text="cargando"/>)
    return login ? <UserLogged /> : <UserGuest />
    
    
}