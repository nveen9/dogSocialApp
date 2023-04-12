import React from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from './Home';
import Post from './Post';
import Profile from './Profile';

const TabNav = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, colour }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline"
            size = focused ? size + 4 : size + 2;
          } else if (route.name === "Post") {
            iconName = focused ? "ios-add-circle" : "ios-add-circle-outline"
            size = focused ? size + 4 : size + 2;
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-person-sharp" : "ios-person-outline"
            size = focused ? size + 4 : size + 2;
          }
          return <Ionic name={iconName} size={size} colour={colour} />
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            display: 'flex'
          },
          null
        ]
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Post" component={Post} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default TabNav
