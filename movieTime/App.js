import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import signUp from './components/signUp';


const Stack = createStackNavigator();




export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="signUp">
      
        <Stack.Screen 
          name="signUp" 
          component={signUp} 
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
