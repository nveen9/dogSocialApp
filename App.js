import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/Login';
import Signup from './screens/Signup';
import TabNav from './screens/TabNav';

const Stack = createStackNavigator();

const App =() => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login'}}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="TabNav" component={TabNav} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;
