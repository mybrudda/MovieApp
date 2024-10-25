import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from '../firebaseConfig';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation()

  const handleLogin = async () => {
    try {
        
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setErrorMessage('')
      setEmail('')
      setPassword('')
      navigation.navigate('Home')

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
        <Text style={styles.linkText}>Create new account</Text>
      </TouchableOpacity>


    </View>
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

export default Login;
