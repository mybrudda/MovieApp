import { StyleSheet } from "react-native";

export default reviewStyles = StyleSheet.create({
  reviewsContainer: {
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 15,
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
  deleteIcon: {
    padding: 5,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});


