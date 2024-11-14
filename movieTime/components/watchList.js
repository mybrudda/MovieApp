import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Image, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { auth, db } from "../firebaseConfig";

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

  const handleDelete = (movieId) => {
    Alert.alert("Delete", "Are you sure you want to remove this movie?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const movieRef = doc(db, "users", auth.currentUser.uid, "watchlist", movieId);
            await deleteDoc(movieRef);
            setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
          } catch (error) {
            Alert.alert("Error", "Could not delete the movie. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Watchlist</Text>
      </View>



      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("MovieInfo", { movieId: item.id })}>
            <Card containerStyle={styles.movieContainer}>
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster}` }}
                  style={styles.poster}
                />
                <View style={styles.movieDetails}>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{item.title}</Text>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteIcon}>
                      <Icon name="trash-2" size={24} color="#9c0000" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.releaseDate}>
                    {item.releaseYear ? format(new Date(item.releaseYear), "yyyy") : "Unknown"}
                  </Text>
                  <Text style={styles.overview} numberOfLines={4}>
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#444",
    marginBottom: 5,
  },
  movieContainer: {
    padding: 20,
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
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
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  releaseDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  deleteIcon: {
    padding: 5,
  },
});

export default Watchlist;
