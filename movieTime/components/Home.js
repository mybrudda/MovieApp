import { useNavigation } from "@react-navigation/native";
import { format } from 'date-fns';
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Image, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { auth } from "../firebaseConfig";

const Home = () => {
  const [name, setName] = useState("");
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const apiKey = "5abdca4f5f81bf07d200a0521be782ef";
  const api = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

  const navigation = useNavigation();

  const fetchMovies = async () => {
    try {
      const response = await fetch(api);
      const data = await response.json();
      setMovies(data.results);

    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName);
    }
    fetchMovies();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Error logging out");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          placeholder="Search for movies..."
          placeholderTextColor="#666"
          value={searchValue}
          onChangeText={setSearchValue}
          inputContainerStyle={styles.inputContainer}
          leftIcon={<Icon name="search" size={24} color="#666" />}
        />
      </View>

      <View style={styles.content}>
        <Text h4 style={styles.welcomeText}>
          Welcome, {name}
        </Text>
        <Button
          title="Logout"
          buttonStyle={styles.logoutButton}
          onPress={handleLogout}
        />
      </View>

      

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card containerStyle={styles.movieContainer}>
            <View style={styles.cardContent}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w200${
                    item.poster_path || ""
                  }`,
                }}
                style={styles.poster}
              />

              <View style={styles.movieDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.releaseDate}>
                  {format(new Date(item.release_date), 'yyyy')}
                </Text>
                <Text style={styles.overview} numberOfLines={4}>
                  {item.overview}
                </Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: "10%",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#3f51b5",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingLeft: 10,
  },
  content: {
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#444",
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: "#e57373",
    borderRadius: 5,
  },
  movieContainer: {
    padding: 20,
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
  },
  cardContent: {
    flexDirection: "row",
  },
  poster: {
    width: 130,
    height: 180,
    borderRadius: 8,
    marginRight: 15,
  },
  movieDetails: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default Home;
