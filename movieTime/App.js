import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import MovieInfo from "./components/MovieInfo.js";
import Ratings from "./components/Ratings.js";
import Signup from './components/Signup.js';
import Watchlist from "./components/Watchlist.js";
import { auth } from "./firebaseConfig";

const Stack = createStackNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        setUserLoggedIn(true);
      } 
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userLoggedIn ? "Home" : "Login"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MovieInfo" component={MovieInfo} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Watchlist" component={Watchlist} />
        <Stack.Screen name="Ratings" component={Ratings} />
 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
