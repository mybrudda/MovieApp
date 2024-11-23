import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Image, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { auth, db } from "../firebaseConfig";
import listStyles from '../styles/MovieListStyle';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchWatchlist(user.uid);
    }
  }, []);

  const fetchWatchlist = async (userId) => {
    try {
      const watchlistRef = collection(db, "users", userId, "watchlist");
      const snapshot = await getDocs(watchlistRef);
      const watchlistMovies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(watchlistMovies);
    } catch (error) {
      Alert.alert("Error", "Could not fetch watchlist. Please try again.");
    }
  };

  const handleDelete = async (movieId) => {
    try {
      const movieRef = doc(db, "users", auth.currentUser.uid, "watchlist", movieId);
      await deleteDoc(movieRef);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      Alert.alert("Error", "Could not delete the movie. Please try again.");
    }
  };

  return (
    <View style={listStyles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Watchlist</Text>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("MovieInfo", { movieId: item.id })}>
            <Card containerStyle={listStyles.movieContainer}>
              <View style={listStyles.cardContent}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster}` }}
                  style={listStyles.poster}
                />
                <View style={listStyles.movieDetails}>
                  <View style={listStyles.titleWrapper}>
                    <View style={listStyles.titleText}>
                      <Text style={listStyles.title}>{item.title}</Text>
                    </View>
                    <TouchableOpacity
                      style={listStyles.deleteIcon}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Icon name="trash-2" size={24} color="#9c0000" />
                    </TouchableOpacity>
                  </View>
                  <Text style={listStyles.releaseDate}>
                    {item.releaseYear ? format(new Date(item.releaseYear), "yyyy") : "Unknown"}
                  </Text>
                  <Text style={listStyles.overview} numberOfLines={4}>
                    {item.overview}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
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
    backgroundColor: "#007bff",
    height: 140,
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 18,
  },
  deleteIcon: {
    padding: 5,
  },
});

export default Watchlist;
