import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Input, Text } from "react-native-elements";
import { auth } from "../firebaseConfig";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    setErrorMessage("");
  }, []);

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      if (email.length > 0 && password.length > 0) {
        await signInWithEmailAndPassword(auth, email, password);
        setEmail("");
        setPassword("");

        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        setErrorMessage("Please fill in all the fields");
      }
    } catch (error) {
      setErrorMessage("Error: Entered email or password is not correct");
    }
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Text h3 style={styles.title}>
          Login
        </Text>

        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : null}

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          leftIcon={{ type: "material", name: "email", color: "#666" }}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={{ type: "material", name: "lock", color: "#666" }}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <Button
          title="Login"
          onPress={handleLogin}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />

        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Signup")}
        >
          Create new account
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f4f6f8",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  error: {
    color: "#d9534f",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3f51b5",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 20,
    fontSize: 16,
    color: "#3f51b5",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default Login;
