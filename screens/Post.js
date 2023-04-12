import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import Geolocation from "@react-native-community/geolocation";
import axios from 'axios';

const Post = () => {
  const backImg = require("../resou/addImg.png");
  const [image, setImage] = useState(backImg);
  const [uploading, setUploading] = useState(false);
  const [anotherUploading, setAnotherUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [description, setDescription] = useState(null);

  //Get current user
  const user = auth().currentUser;

  //Pick Image from camera
  const pickImage = () => {
    ImagePicker.openCamera({
      width: 1920,
      height: 1080,
      cropping: true,
    }).then((image) => {
      console.log(image);
      setImage(image.path);
    });
  };

  //Pick Image from gallery
  const pickImageLibrary = () => {
    ImagePicker.openPicker({
      width: 1920,
      height: 1080,
      cropping: true,
    }).then((image) => {
      console.log(image);
      setImage(image.path);
    });
  };

  const uploadPost = async () => {
    const { latitude, longitude, locality } = await currentloc();
    const iUrl = await uploadImg();

    //check for iUrl is not empty
    if (typeof iUrl !== "undefined") {
      console.log("Image Url from firebase:: ", iUrl);

      firestore()
        .collection("Post")
        .add({
          userID: user.uid,
          description: description,
          img: iUrl,
          helped: false,
          geoL: new firestore.GeoPoint(latitude, longitude),
          local: locality,
          time: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          console.log("Post added successfully.");
          Alert.alert(
            "Post added successfully",
            "Your post has been added successfully."
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    }
  };

  //Upload image by click upload button
  const uploadImg = async () => {
    //Get the image which pick
    const uploadUri = image;
    if (uploadUri == backImg) {
      return null;
    }
    console.log("uri: " + uploadUri);
    //Get filename
    let fname = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    //To add time to end of the file name
    const exts = fname.split(".").pop();
    const beforeExts = fname.split(".").slice(0, -1).join(".");
    fname = beforeExts + Date.now() + "." + exts;

    setUploading(true);
    setTransferred(0);

    const sRef = storage().ref(user.uid + "/" + fname);
    const task = sRef.putFile(uploadUri);

    task.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );
      setTransferred(
        //Get the percentage of bytes transferred
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100
      );
    });

    try {
      await task;

      //Get image url from firebase storage
      const imgUrl = await sRef.getDownloadURL();

      setUploading(false);
      setImage(backImg);
      return imgUrl;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  //get current location
  const currentloc = async () => {
    try {
      setUploading(true);
      setAnotherUploading(true);
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            try {
              const response = await axios.get(url);
              const address = response.data.address;
              const locality = address.city || address.town || address.village || '';

              resolve({ latitude, longitude, locality });
              setAnotherUploading(false);
              setUploading(false);
            } catch (error) {
              console.log(error);
            }
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.inner}>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              onChangeText={(text) => setDescription(text)}
              placeholder="Describe here..."
            />
            <Image
              source={image == backImg ? image : { uri: image }}
              style={{ width: "100%", height: 200, resizeMode: "contain" }}
            />
            <View style={styles.btnView}>
              <Button
                title="Pick Image from Camera"
                color="#FFD700"
                onPress={pickImage}
              />
            </View>
            <View style={styles.btnView}>
              <Button
                title="Pick Image from Library"
                color="#FFD700"
                onPress={pickImageLibrary}
              />
            </View>
            {uploading ? (
              <>{anotherUploading ? (
                <ActivityIndicator size="large" color="#FFD700" />
              ) : (
                <>
                <Text>{transferred} % Completed</Text>
                <ActivityIndicator size="large" color="#FFD700" />
                </>
              )}
              </>
            ) : (
              <View style={styles.btnView}>
                <Button title="Upload" color="#FFD700" onPress={uploadPost} />
              </View>
            )}
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 100,
    width: 320,
    textAlignVertical: "top",
    borderColor: "#C0C0C0",
    margin: 10,
    padding: 10,
  },
  btnView: {
    width: "100%",
    marginVertical: 10,
  },
});

export default Post;
