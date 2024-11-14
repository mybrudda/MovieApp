import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Button, Card, Image, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { auth, db } from "../firebaseConfig";

const MovieInfo = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isRatingFormVisible, setIsRatingFormVisible] = useState(false);

  const scrollViewRef = useRef(null);
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

  const fetchReviews = async () => {
    try {
      const reviewsRef = collection(
        db,
        "movies",
        movieId.toString(),
        "reviews"
      );
      const snapshot = await getDocs(reviewsRef);
      const movieReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(movieReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Alert.alert("Error", "Could not fetch reviews. Please try again.");
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [movieId]);

  if (!movie) {
    return <Text style={styles.errorText}>Movie not found</Text>;
  }

  const getRatingBackgroundColor = (rating) => {
    if (rating < 5) return "#ff5f5f";
    if (rating >= 5 && rating < 7) return "orange";
    return "lightgreen";
  };

  const scrollToRatingForm = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 1000, animated: true });
    }
  };

  const submitReview = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Please log in to submit a review");
      return;
    }
  
    if (!rating || isNaN(rating) || rating < 1 || rating > 10) {
      Alert.alert("Invalid Rating", "Please enter a rating between 1 and 10.");
      return;
    }
  
    const reviewData = {
      userId: user.uid,
      movieId: movieId,
      movieName: movie.title,
      userName: user.displayName,
      title: movie.title,
      rating: parseFloat(rating),
      review: review,
      reviewDate: serverTimestamp(),
    };
  
    try {
      // Add the review to the movie's reviews subcollection
      await setDoc(doc(db, "movies", movieId.toString(), "reviews", user.uid), reviewData);
  
      // Add the review to the user's reviews collection
      await setDoc(doc(db, "users", user.uid, "reviews", movieId.toString()), reviewData);
  
      Alert.alert("Review Submitted", "Your review has been submitted.");
      setRating("");
      setReview("");
      setIsRatingFormVisible(false);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review", error);
      Alert.alert("Error", "Could not submit review. Please try again.");
    }
  };
  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.appName}>Movie info</Card.Title>
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

      {isRatingFormVisible && (
        <View style={styles.ratingFormContainer}>
          <Text style={styles.ratingLabel}>Rate the movie (1-10):</Text>
          <TextInput
            style={styles.ratingInput}
            placeholder="Enter a rating (1-10)"
            keyboardType="numeric"
            maxLength={2}
            value={rating}
            onChangeText={setRating}
          />

          <Text style={styles.reviewLabel}>Write your review:</Text>
          <TextInput
            style={styles.reviewTextArea}
            placeholder="Enter your review here..."
            multiline
            value={review}
            onChangeText={setReview}
          />

          <Button title="Submit Review" onPress={submitReview} />
        </View>
      )}

      <Button
        title="Rate It"
        buttonStyle={styles.rateButton}
        onPress={() => {
          setIsRatingFormVisible(!isRatingFormVisible);
          scrollToRatingForm();
        }}
        icon={
          <Icon
            name="star"
            size={20}
            color="white"
            style={{ marginRight: 5 }}
          />
        }
      />
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Reviews:</Text>
        {reviews.length > 0 ? (
          reviews.map((item) => (
            <View key={item.id} style={styles.reviewItem}>
              <Text style={styles.reviewUser}>{item.userName}</Text>
              <Text style={styles.reviewRating}>Rating: {item.rating}</Text>
              <Text style={styles.reviewText}>{item.review}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noReviewsText}>No reviews available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  card: {
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  genres: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5e96b6",
  },
  appName: {
    color: "#2d74da",
    alignSelf: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 22,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginVertical: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginVertical: 5,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    padding: 6,
    borderRadius: 4,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
    width: 50,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  overviewContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  overview: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },
  castContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  castTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  castScroll: {
    flexDirection: "row",
  },
  castMemberContainer: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 80,
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
    marginBottom: 5,
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
  ratingFormContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  ratingInput: {
    height: 40,
    borderColor: "#007ACC",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  reviewTextArea: {
    height: 100,
    borderColor: "#007ACC",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#f8f9fa",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  rateButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 30,
    width: 120,
    alignSelf: "center",
  },
  reviewsContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  reviewItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reviewRating: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  noReviewsText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MovieInfo;
