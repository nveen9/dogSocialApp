import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert, ScrollView, View, TextInput, Linking } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Container, } from '../styled/styled';
import FlatListt from '../comp/FlatListt';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Toast from "react-native-simple-toast";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [list, setList] = useState([]);

  // let items1 = [];
  // let items2 = [];

  // //get user data from firestore
  // useEffect(() => {
  //   const subscriber = firestore()
  //     .collection('Users')
  //     .onSnapshot(querySnapshot => {
  //       querySnapshot.forEach(documentSnapshot => {
  //         items1.push({
  //           ...documentSnapshot.data(),
  //           key: documentSnapshot.id,
  //         });
  //       });

  //       setList(items1);
  //     });

  //   // Unsubscribe from events when no longer in use
  //   return () => subscriber();
  // }, []);

  //retrieve data from post and realtime change and combine user and post collections
  // useEffect(() => {
  //   const subscriber = firestore()
  //     .collection('Post')
  //     .orderBy('time', 'desc')
  //     .onSnapshot(querySnapshot => {
  //       querySnapshot.forEach(documentSnapshot => {
  //         items2.push({
  //           ...documentSnapshot.data(),
  //           key: documentSnapshot.id,
  //         });
  //       });

  //       const combinedItems = items2.map(item2 => {
  //         // Find the matching items1 element
  //         const matchingItem1 = items1.find(item1 => item1.user === item2.userID);
  //         // Combine the data from both elements
  //         return {
  //           id: item2.key,
  //           uName: matchingItem1 ? matchingItem1.email : null,
  //           userID: item2.userID,
  //           timeStmp: item2.time,
  //           describe: item2.description,
  //           desImg: item2.img,
  //           uImg: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  //           bottomLiked: true,
  //           bottomLike: '4'
  //         };
  //       });
  //       setList(combinedItems);
  //       setLoading(false);
  //       console.log('Combined Array: ', combinedItems);
  //     });

  //   // Unsubscribe from events when no longer in use
  //   return () => subscriber();
  // }, []);

  //retrieve data from post and realtime change
  useEffect(() => {
    const subscriber = firestore()
      .collection('Post')
      .orderBy('time', 'desc')
      .onSnapshot(async querySnapshot => {
        //array to store
        const list = [];
        console.log('Total Posts: ', querySnapshot.size);
        for (const documentSnapshot of querySnapshot.docs) {
          const { userID, description, img, time, helped, local } = documentSnapshot.data();
          //to get username, because it stored on another collection
          const snapshot = await firestore()
            .collection('Users')
            .doc(userID)
            .get();
          const username = snapshot.data().name;
          //put all to the array
          list.push({
            id: documentSnapshot.id,
            userID,
            uName: username,
            uImg: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            timeStmp: time,
            local,
            describe: description,
            desImg: img,
            helped,
          });
        }
        //set array after the for loop
        setPosts(list);
        setLoading(false);
      });
    return () => subscriber();

    //only get value from post and username does not pass
    // function onResult(querySnapshot) {
    //   //array to store
    //   const list = [];
    //   console.log('Total Posts: ', querySnapshot.size);
    //   querySnapshot.forEach(documentSnapshot => {
    //     const { userID, description, img, time } = documentSnapshot.data();
    //     async function ex() {
    //       const snapshot = await firestore()
    //         .collection('Users')
    //         .doc(userID)
    //         .get();
    //       return snapshot.data().email;
    //     }
    //     (async () => {
    //       const username = await ex();
    //       console.log('user', username);
    //     })();
    //     list.push({
    //       id: documentSnapshot.id,
    //       userID,
    //       uName: 'Ravindu Weedagama',
    //       uImg: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    //       timeStmp: time,
    //       describe: description,
    //       desImg: img,
    //       bottomLiked: true,
    //       bottomLike: '4'
    //     });
    //     setPosts(list);
    //     setLoading(false);
    //   })
    // }

    // function onError(error) {
    //   console.log('Error from Firebase: ', error);
    // }

    // const subscriber = firestore().collection('Post').orderBy('time', 'desc').onSnapshot(onResult, onError);
    // return () => subscriber();
  }, []);

  //contact
  const contact = async (userid) => {
    const snapshot = await firestore()
            .collection('Users')
            .doc(userid)
            .get();
    const num = snapshot.data().number;
    Linking.openURL(`tel:${num}`);
  }

  //alert when helped post
  const helpAlert = (postID) => {
    Alert.alert(
      'Mark as Helped',
      'Do you want to mark as Helped?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Canceled'),
          style: 'cancel'
        },
        {
          text: 'Helped',
          onPress: () => helpP(postID)
        },
      ],
      { cancelable: false }

    );
  }

  //mark as helped
  const helpP = async (postID) => {
    await firestore()
      .collection('Post')
      .doc(postID)
      .update({
        helped: true,
      })
      .then(() => {
        console.log('User updated!');
      });
  }

  //alert when not helped post
  const notHelpAlert = (postID) => {
    Alert.alert(
      'Mark as Not Helped',
      'Do you want to mark as Not Helped?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Canceled'),
          style: 'cancel'
        },
        {
          text: 'Not Helped',
          onPress: () => notHelpP(postID)
        },
      ],
      { cancelable: false }

    );
  }

  //mark as not helped
  const notHelpP = async (postID) => {
    await firestore()
      .collection('Post')
      .doc(postID)
      .update({
        helped: false,
      })
      .then(() => {
        console.log('User updated!');
      });
  }

  //alert when delete post
  const deleteAlert = (postID) => {
    Alert.alert(
      'Delete the Post',
      'Do you want to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Canceled'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => deleteP(postID)
        },
      ],
      { cancelable: false }

    );
  }

  //delete post
  const deleteP = (postID) => {
    console.log('Post ID: ', postID);

    //delete from storage
    firestore().collection('Post')
      .doc(postID)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const { img } = documentSnapshot.data();

          //check there is image
          if (img != null) {
            const sRef = storage().refFromURL(img);
            const imgRef = storage().ref(sRef.fullPath);
            imgRef.delete()
              .then(() => {
                console.log(img, ' Deleted from Storage');
                deleteFromFireStore(postID);
              })
              .catch((e) => {
                console.log(e);
              })
          } else {
            deleteFromFireStore(postID);
          }
        }
      })
  }

  //delete from firestore
  const deleteFromFireStore = (postID) => {
    firestore().collection('Post')
      .doc(postID)
      .delete()
      .then(() => {
        console.log(postID, ' Post Deleted from Firestore');
        Alert.alert(
          'Post deleted successfully',
          'Your post has been deleted successfully.',
        );
      })
      .catch((e) => {
        console.log(e);
      })
  }

  //find Vet
  async function findVet(postID) {
    try {
      console.log('Post ID: ', postID);

      //get geo points from firestore
      const doc = await firestore().collection('Post').doc(postID).get();
      const geopoint = doc.data().geoL;

      //assign lat and long from geo points
      const latitude = geopoint.latitude;
      const longitude = geopoint.longitude;

      console.log('lat: ', latitude, 'lng: ', longitude);

      //find nearest vets by given lat and long
      const urlPha = `geo:${latitude},${longitude}?q=veterinarian`;
      Linking.canOpenURL(urlPha).then(supported => {
        if (supported) {
          Linking.openURL(urlPha);
        } else {
          Toast.show("Can't Find", Toast.SHORT);
          console.log("Can't Find, maybe Your don't have Google Maps in your mobile or Didn't enable");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //find pharmacies
  async function findPhar(postID) {
    try {
      console.log('Post ID: ', postID);

      //get geo points from firestore
      const doc = await firestore().collection('Post').doc(postID).get();
      const geopoint = doc.data().geoL;

      //assign lat and long from geo points
      const latitude = geopoint.latitude;
      const longitude = geopoint.longitude;

      console.log('lat: ', latitude, 'lng: ', longitude);

      //find nearest vets by given lat and long
      const urlPha = `geo:${latitude},${longitude}?q=pharmacies`;
      Linking.canOpenURL(urlPha).then(supported => {
        if (supported) {
          Linking.openURL(urlPha);
        } else {
          Toast.show("Can't Find", Toast.SHORT);
          console.log("Can't Find, maybe Your don't have Google Maps in your mobile or Didn't enable");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  //find location
  async function findLoc(postID) {
    try {
      console.log('Post ID: ', postID);

      //get geo points from firestore
      const doc = await firestore().collection('Post').doc(postID).get();
      const geopoint = doc.data().geoL;

      //assign lat and long from geo points
      const latitude = geopoint.latitude;
      const longitude = geopoint.longitude;

      console.log('lat: ', latitude, 'lng: ', longitude);

      //find nearest vets by given lat and long
      const urlPha = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.canOpenURL(urlPha).then(supported => {
        if (supported) {
          Linking.openURL(urlPha);
        } else {
          Toast.show("Can't Find", Toast.SHORT);
          console.log("Can't Find, maybe Your don't have Google Maps in your mobile or Didn't enable");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const filteredData = searchQuery
  ? posts.filter((item) => item.local.toLowerCase().includes(searchQuery.toLowerCase()) || item.describe.toLowerCase().includes(searchQuery.toLowerCase()))
  : posts;

  if (loading) {
    return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
      <SkeletonPlaceholder borderRadius={5}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View style={{ width: 60, height: 60, borderRadius: 50 }} />
          <View style={{ marginLeft: 20 }}>
            <View style={{ width: 120, height: 20, borderRadius: 5 }} />
            <View style={{ marginTop: 5, width: 80, height: 20, borderRadius: 5 }} />
          </View>
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }} >
          <View style={{ width: 335, height: 30, borderRadius: 5 }} />
          <View style={{ marginTop: 10, width: 335, height: 180, borderRadius: 5 }} />
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={5}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View style={{ width: 60, height: 60, borderRadius: 50 }} />
          <View style={{ marginLeft: 20 }}>
            <View style={{ width: 120, height: 20, borderRadius: 5 }} />
            <View style={{ marginTop: 5, width: 80, height: 20, borderRadius: 5 }} />
          </View>
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }} >
          <View style={{ width: 335, height: 30, borderRadius: 5 }} />
          <View style={{ marginTop: 10, width: 335, height: 180, borderRadius: 5 }} />
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={5}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View style={{ width: 60, height: 60, borderRadius: 50 }} />
          <View style={{ marginLeft: 20 }}>
            <View style={{ width: 120, height: 20, borderRadius: 5 }} />
            <View style={{ marginTop: 5, width: 80, height: 20, borderRadius: 5 }} />
          </View>
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }} >
          <View style={{ width: 335, height: 30, borderRadius: 5 }} />
          <View style={{ marginTop: 10, width: 335, height: 180, borderRadius: 5 }} />
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  }

  return (
    <Container>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location or description"
          placeholderTextColor="#CACACA"
          selectionColor="#CACACA"
          value={searchQuery}
          onChangeText={(query) => setSearchQuery(query)}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <FlatListt item={item} onContact={contact} onHelp={helpAlert} onNotHelp={notHelpAlert} onDelete={deleteAlert} onFindVet={findVet} onFindPhar={findPhar} onFindLoc={findLoc} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#FDFDFD',
    padding: 15,
    width: '100%',
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    color: '#000000',
    padding: 8,
    borderRadius: 8,
  },
});

export default Home