import { ScrollView, View, Text, Image, TextInput, Alert, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Signup = ({ navigation }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [fname, setFname] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState(0);
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const registerInUser = () => {
    if(email==''){
      Alert.alert(
        'Empty Field',
        'Please Enter Email Address',
      );
    }
    else if(password==''){
      Alert.alert(
        'Empty Field',
        'Please Enter Password',
      );
    }
    else if(fname==''){
      Alert.alert(
        'Empty Field',
        'Please Enter Name',
      );
    }
    else if(number==''){
      Alert.alert(
        'Empty Field',
        'Please Enter Phone Number',
      );
    }
    else{
    auth().createUserWithEmailAndPassword(email, password)
      .then((e) => {
        console.log(e, "Auth Success");
        setIsSignedIn(true);
        const user = auth().currentUser;
        firestore().collection('Users').doc(user.uid)
          .set({
            name: fname,
            email: email,
            number: parseInt(number),
            password: password,
            user: user.uid,
          })
          .then(() => {
            console.log('User added!');
            navigation.navigate('TabNav');
            Alert.alert(
              'Success',
              'User registered successfully',
            );
          });

      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert(
            'Incorrect',
            'That email address is already in use!',
          );
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          Alert.alert(
            'Incorrect',
            'That email address is invalid!',
          );
        }
        console.error(error);
      })
    }
  }

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.inner}>
          <View style={styles.textInputContainer}>
              <Feather style={{ marginRight: 10 }} name='user' size={25} color='#D6AD60' />
              <TextInput style={styles.textInput} placeholder='Full Name' value={fname} onChangeText={text => setFname(text)} />
            </View>
            <View style={styles.textInputContainer}>
              <Fontisto style={{ marginRight: 10 }} name='email' size={25} color='#D6AD60' />
              <TextInput style={styles.textInput} placeholder='Email' value={email} onChangeText={text => setEmail(text)} />
            </View>
            <View style={styles.textInputContainer}>
              <Feather style={{ marginRight: 10 }} name='phone' size={25} color='#D6AD60' />
              <TextInput style={styles.textInput} placeholder='Phone Number' value={number} keyboardType="numeric" onChangeText={number => setNumber(number)} />
            </View>
            <View style={styles.textInputContainer}>
              <Feather style={{ marginRight: 10 }} name='lock' size={25} color='#D6AD60' />
              <TextInput style={styles.textInput} placeholder='Password' value={password} secureTextEntry={secureTextEntry} onChangeText={text => setPassword(text)} />
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <MaterialIcons
                name={
                  secureTextEntry
                    ? 'visibility-off'
                    : 'visibility'
                }
                size={25}
                color='#D6AD60'
              />
            </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.button} title='Register' onPress={registerInUser}>
                <Text style={styles.loginText}>Register</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnContainer}>
              <View style={styles.signUpContainer}>
                <Text style={{ marginRight: 10 }}>
                  Already have an account?
                </Text>
                <TouchableOpacity title='Login' onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signUpText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  img: {
    resizeMode: 'contain',
    width: 320,
    height: 300,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 50,
  },
  loginText: {
    fontSize: 15,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    width: '80%',
    paddingBottom: 10,
  },
  btnContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontWeight: 'bold',
    color: '#D1B000',
  },
});

export default Signup