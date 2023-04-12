import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";

const Profile = ({ navigation }) => {

  const [isSignedIn, setIsSignedIn] = useState(false);

  const userID = auth().currentUser.uid;
  const [username, setUsername] = useState('');

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(userID)
      .onSnapshot(documentSnapshot => {
        setUsername(documentSnapshot.data().name);
      });
      return () => subscriber();
  }, []);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        setIsSignedIn(false);
        console.log('User signed out!');
        navigation.navigate('Login');
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <View style={styles.container}>
      <View style={styles.txtContainer}>
      <Text style={styles.txt}>Welcome</Text>
      <Text style={styles.txtUser}>{username}</Text>
      </View>
      <View style={styles.btnContainer}>
      <Button title='Logout' color="#D1B000" onPress={signOut} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    margin: 10,
  },
  txt: {
    fontSize: 50,
    color: "#FFD700",
    fontWeight: 'bold',
  },
  txtUser: {
    fontSize: 25,
    color: "#FFD700",
  }
});

export default Profile