import React, { useEffect } from 'react';
import { LogBox } from 'react-native';

import firebase from 'firebase/app';
import { firebaseApp } from './app/utils/firebase';
import 'firebase/database';
import "firebase/auth"

import Navigation from './app/navigations/Navigation';

LogBox.ignoreLogs(['Setting a timer'])

export default function App() {
  return (
    <Navigation/>
    
  );
}

