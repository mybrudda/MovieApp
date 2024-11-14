import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  ButtonGroup,
  Card,
  Image,
  Input,
  Text,
} from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { auth, db } from "../firebaseConfig";

const Home = () => {
  const [name, setName] = useState("");
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [page, setPage] = useState(1);


  const flatListRef = useRef(null);

  const apiKey = "5abdca4f5f81bf07d200a0521be782ef";
  const api = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
  const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchValue}&page=${page}`;

  const handleSearch = () => {
    setPage(1);
    fetchMovies();
  };

  const navigation = useNavigation();

  const fetchMovies = async () => {
    try {
      const response = await fetch(searchValue ? searchApi : api);
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
  }, [page]);

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

  const handlePageChange = (selectedIndex) => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (selectedIndex === 0 && page > 1) {
      setPage(page - 1);
    } else if (selectedIndex === 1) {
      setPage(page + 1);
    }
  };

  const addToWatchlist = async (movie) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Please log in to add movies to your watchlist");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid, "watchlist", movie.id.toString()),
        {
          title: movie.title,
          poster: movie.poster_path,
          releaseYear: movie.release_date,
          overview: movie.overview,
          addedAt: serverTimestamp(),
        }
      );

      Alert.alert(
        "Added to Watchlist",
        `${movie.title} has been added to your watchlist.`
      );
    } catch (error) {
      console.error("Error adding to watchlist", error);
      Alert.alert("Error", "Could not add to watchlist. Please try again.");
    }
  };

  const navigateToWatchlist = () => {
    navigation.navigate("Watchlist");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.first}>
          <Text style={styles.appName}>MovieTime</Text>

          <Icon
            name="log-out"
            size={30}
            color="white"
            onPress={handleLogout}
            style={styles.logoutIcon}
          />
        </View>

        <Input
          placeholder="Search for movies..."
          placeholderTextColor="#666"
          value={searchValue}
          onChangeText={(value) => setSearchValue(value)}
          onSubmitEditing={handleSearch}
          inputContainerStyle={styles.inputContainer}
          leftIcon={<Icon name="search" size={24} color="#666" />}
          containerStyle={styles.inputWrapper}
        />
      </View>

      <View style={styles.content}>
        <Text h4 style={styles.welcomeText}>
        {name}
        </Text>
        <Button
          title="Watchlist"
          onPress={navigateToWatchlist}
          icon={
            <Icon
              name="bookmark" 
              size={20}
              color="white"
              style={{ marginRight: 5 }} 
            />
          }
          iconPosition="left"
        />
        <Button
      title="Rating"
      onPress={() => navigation.navigate('Ratings')}
      icon={
        <Icon
          name="star"  
          size={20}
          color="white"
          style={{ marginRight: 5 }} 
        />
      }
      iconPosition="left"  
    />
        <Text style={styles.pageNum}> {page}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MovieInfo", { movieId: item.id })
            }
          >
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
                  <View style={styles.titleWrapper}>
                    <View style={styles.titleText}>
                      <Text style={styles.title}>{item.title}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.iconWrapper}
                      onPress={() => addToWatchlist(item)}
                    >
                      <Icon name="bookmark" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.releaseDate}>
                    {item.release_date
                      ? format(new Date(item.release_date), "yyyy")
                      : "Unknown"}
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

      <ButtonGroup
        buttons={[
          <View>
            <Icon name="chevron-left" size={25} color="#fff" />
          </View>,
          <View>
            <Icon name="chevron-right" size={25} color="#fff" />
          </View>,
        ]}
        selectedIndex={null}
        onPress={handlePageChange}
        containerStyle={styles.buttonGroupContainer}
        buttonStyle={styles.buttonStyle}
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
  },
  first: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  appName: {
    color: "white",
    alignSelf: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 18,
  },
  logoutIcon: {
    padding: 10,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingLeft: 10,
    width: 350,
    height: 40,
    alignSelf: "center",
    marginTop: 5,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
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
  titleText: {
    flex: 1,
    marginRight: 10,
  },
  overview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  buttonGroupContainer: {
    marginVertical: 10,
    borderRadius: 8,
    width: "60%",
    alignSelf: "center",
  },
  buttonStyle: {
    backgroundColor: "blue",
  },
  pageNum: {
    fontSize: 20,
  },
});

export default Home;
