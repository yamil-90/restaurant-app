import * as firebase from 'firebase';

export function reAuthenticate(password){
    console.log('auth')
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
    );
    return user.reauthenticateWithCredential(credentials)
}
