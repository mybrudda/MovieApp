import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { Button, Card, Input, Text } from "react-native-elements";
import { auth, db } from "../firebaseConfig";
import styles from "../styles/AuthStyle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    setErrorMessage("");
  }, []);

  const navigateToSignup = () => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
    navigation.navigate("Signup");
  };

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      if (email.length > 0 && password.length > 0) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        if (user.emailVerified) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!userData.verified) {
              await updateDoc(userRef, { verified: true });
            }
          }

          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } else {
          await auth.signOut();
          setErrorMessage("Please verify your email before logging in.");
        }
      } else {
        setErrorMessage("Please fill in all the fields");
      }
    } catch (error) {
      console.log("Error logging in: ", error.message);
      setErrorMessage("Error: Entered email or password is not correct");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

          <Text style={styles.linkText} onPress={navigateToSignup}>
            Don't have an account?
          </Text>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
