
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Button, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { auth } from '../firebaseConfig';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation()

  const handleSignUp = async () => {
    setErrorMessage(""); 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      })
      Alert.alert("Success", "User created successfully!");
    
      setEmail("");
      setPassword("");
      setUsername("");
      
    } catch (error) {
      setErrorMessage(error.message); 
     
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}

        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}

        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Sign Up" onPress={handleSignUp} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Move to Login</Text>
        </TouchableOpacity>
        
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  linkText: {
    marginTop: 20,
    fontSize: 16,
    color: 'purple', 
    textDecorationLine: 'underline', 
    marginVertical: 10,
  },
});

export default SignUp;
