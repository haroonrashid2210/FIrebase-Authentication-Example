import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, LogBox, Button} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  function signin() {
    auth()
      .signInWithEmailAndPassword('haroonrashid2210@gmail.com', 'haroon')
      .then(() => console.log('LOGGED IN'));
  }

  function signup() {
    auth()
      .createUserWithEmailAndPassword('haroonrashid2210@gmail.com', 'haroon')
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

  function signout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  async function emailVarification() {
    await firebase
      .auth()
      .currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: 'app/email-verification',
      })
      .then(() => console.log('Done'));
  }

  async function resetPassword() {
    firebase
      .auth()
      .sendPasswordResetEmail('haroonrashid2210@gmail.com')
      .then(function (user) {
        alert('Please check your email...');
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  async function emailVarification() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        console.log('GOOD');
      });
  }

  function isemailvarified() {
    firebase.auth().currentUser.reload();
    if (firebase.auth().currentUser.emailVerified) {
      console.log('GOOD');
    } else {
      console.log('BAD');
    }
  }

  if (!user) {
    return (
      <View>
        <TextInput placeholder={'email'} />
        <TextInput placeholder={'email'} />
        <Button title={'SIGNUP'} onPress={() => signup()} />
        <Button title={'LOGIN'} onPress={() => signin()} />
        <Button title={'RESET PASSWORD'} onPress={() => resetPassword()} />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button title={'Signout'} onPress={() => signout()} />
      <Button title={'Verify email'} onPress={() => emailVarification()} />
      <Button
        title={'Check email varified?'}
        onPress={() => isemailvarified()}
      />
    </View>
  );
}
