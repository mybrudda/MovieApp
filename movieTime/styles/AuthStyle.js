import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "lightblue",
  },
  card: {
    width: "100%",
    paddingVertical: 50,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 16,
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: "#3f51b5",
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  linkText: {
    marginTop: 16,
    fontSize: 14,
    color: "#3f51b5",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
