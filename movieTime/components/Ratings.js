import { useNavigation } from "@react-navigation/native";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { auth, db } from "../firebaseConfig";

const Ratings = () => {
  const [reviews, setReviews] = useState([]);
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserReviews(user.uid);
    }
  }, [user]);


  const fetchUserReviews = async (userId) => {
    try {
      const reviewsRef = collection(db, "users", userId, "reviews");
      const snapshot = await getDocs(reviewsRef);
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
    } catch (error) {
      Alert.alert("Error", "Could not fetch reviews. Please try again.");
    }
  };

 
  const handleDelete = async (reviewId, movieId) => {
  
          try {
            const userReviewRef = doc(db, "users", user.uid, "reviews", reviewId);
            await deleteDoc(userReviewRef);

            const movieReviewRef = doc(db, "movies", movieId.toString(), "reviews", user.uid);
            await deleteDoc(movieReviewRef);
           
            setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));

          } catch (error) {
            console.error("Error deleting review:", error);
            Alert.alert("Error", "Could not delete the review. Please try again.");
          }
       
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>My Reviews</Text>
      </View>

      <View style={styles.reviewsContainer}>
        {reviews.length > 0 ? (
          reviews.map((item) => (
            <View key={item.id} style={styles.reviewItem}>
              <View style={styles.titleWrapper}>
                <Text style={styles.reviewUser}>{item.title}</Text>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.movieId)} 
                  style={styles.deleteIcon}
                >
                  <Icon name="trash-2" size={24} color="#9c0000" />
                </TouchableOpacity>
              </View>
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
  reviewsContainer: {
    marginTop: 10,
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
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
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
  deleteIcon: {
    padding: 5,
  },
  noReviewsText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Ratings;
