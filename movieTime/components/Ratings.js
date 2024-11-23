import { useNavigation } from "@react-navigation/native";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { auth, db } from "../firebaseConfig";
import ReviewStyle from "../styles/ReviewStyle";

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

      <View style={ReviewStyle.reviewsContainer}>
        {reviews.length > 0 ? (
          reviews.map((item) => (
            <View key={item.id} style={ReviewStyle.reviewItem}>
              <View style={ReviewStyle.titleWrapper}>
                <Text style={ReviewStyle.reviewUser}>{item.title}</Text>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.movieId)} 
                  style={ReviewStyle.deleteIcon}
                >
                  <Icon name="trash-2" size={24} color="#9c0000" />
                </TouchableOpacity>
              </View>
              <Text style={ReviewStyle.reviewRating}>Rating: {item.rating}</Text>
              <Text style={ReviewStyle.reviewText}>{item.review}</Text>
            </View>
          ))
        ) : (
          <Text style={ReviewStyle.noReviewsText}>No reviews available.</Text>
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
 
});

export default Ratings;
