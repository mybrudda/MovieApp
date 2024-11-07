import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Image, Text } from "react-native-elements";

const MovieInfo = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  const apiKey = "5abdca4f5f81bf07d200a0521be782ef";

  const fetchMovieDetails = async () => {
    try {
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
      );
      const movieData = await movieResponse.json();
      setMovie(movieData);

      const castResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`
      );
      const castData = await castResponse.json();
      setCast(castData.cast);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  if (!movie) {
    return <Text style={styles.errorText}>Movie not found</Text>;
  }

  const getRatingBackgroundColor = (rating) => {
    if (rating < 5) return "#ff5f5f";
    if (rating >= 5 && rating < 7) return "orange";
    return "lightgreen";
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.appName}>MovieTime</Card.Title>
        <Card.Divider />

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.poster}
            resizeMode="cover"
          />
        </View>

        <Text h4 style={styles.title}>
          {movie.title}
        </Text>
        <Text
          style={[
            styles.rating,
            { backgroundColor: getRatingBackgroundColor(movie.vote_average) },
          ]}
        >
          {movie.vote_average.toFixed(1)}
        </Text>
      </Card>

      <View style={styles.detailsContainer}>
        <Text style={styles.info}>
          Release Year: {new Date(movie.release_date).getFullYear()}
        </Text>
        <Text style={styles.info}>
          Genres:{" "}
          <Text style={styles.genres}>
            {movie.genres.map((genre) => genre.name).join(",  ")}
          </Text>
        </Text>
        <Text style={styles.info}>Runtime: {movie.runtime} minutes</Text>
        <Text style={styles.info}>
          Language: {movie.spoken_languages[0].english_name}
        </Text>
      </View>

      <View style={styles.overviewContainer}>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>

      <View style={styles.castContainer}>
        <Text style={styles.castTitle}>Cast:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.castScroll}
        >
          {cast.length > 0 ? (
            cast.slice(0, 10).map((member) => (
              <View key={member.id} style={styles.castMemberContainer}>
                {member.profile_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${member.profile_path}`,
                    }}
                    style={styles.castImage}
                  />
                ) : (
                  <Text style={styles.noImageText}>No Image</Text>
                )}
                <Text style={styles.castMemberName}>{member.name}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.info}>No cast information available.</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    margin: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  genres: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5e96b6",
  },
  appName: {
    color: "blue",
    alignSelf: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 24,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  poster: {
    width: 180,
    height: 270,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
    textAlign: "center",
    alignSelf: "flex-end",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#eefffc",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  overviewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#ffffff",
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  overview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },
  castContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#eefffc",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  castTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  castScroll: {
    flexDirection: "row",
  },
  castMemberContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 90,
  },
  castImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  noImageText: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
    color: "#666",
    textAlign: "center",
    lineHeight: 60,
    fontSize: 12,
  },
  castMemberName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default MovieInfo;
