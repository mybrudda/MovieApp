import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification, updateProfile
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Button, Card, Input, Text } from "react-native-elements";
import { auth, db } from "../firebaseConfig";
import styles from "../styles/AuthStyle";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    setErrorMessage("");
  }, []);

  const handleSignUp = async () => {
    setErrorMessage("");

    try {
      if (email.length > 0 && password.length > 0 && username.length > 0) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await sendEmailVerification(user);

        await updateProfile(user, {
          displayName: username,
        });

        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          verified: false,
          createdAt: serverTimestamp(),
        });

        setEmail("");
        setPassword("");
        setUsername("");

        Alert.alert(
          "Verify Email",
          "A verification email has been sent to your email address. Please verify your email before login",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );

      } else {
        setErrorMessage("Please fill in all the fields");
      }
    } catch (error) {
      console.log("Error signing up:", error.message);
      setErrorMessage(
        "Please enter a valid email and password (at least 6 characters long)"
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Text h3 style={styles.title}>
            Sign Up
          </Text>

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <Input
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            leftIcon={{ type: "material", name: "person", color: "#666" }}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
          />

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
            title="Sign Up"
            onPress={handleSignUp}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("Login")}
          >
            Already have an account?
          </Text>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};


export default Signup;
