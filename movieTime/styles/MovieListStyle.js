import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
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
    fontWeight: "900",
    color: "black",
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
    borderWidth: 1,
    borderColor: 'black',
    width: "60%",
    alignSelf: "center",
  },
  buttonStyle: {
    backgroundColor: "transparent",
  },

});
