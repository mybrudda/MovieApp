import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../firebaseConfig';

const Home = () => {

    const [name, setName] = useState('');

    const navigation = useNavigation()

   

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
          setName(user.displayName);
        }
      }, []);

      const handleLogout = async () => {
        try{
            await signOut(auth)
            Alert.alert('Logged Out successfully!')
            navigation.navigate('Login')
        }catch(error){
            Alert.alert('Error loggin out')
        }
      }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.appName}>MovieTime</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
        <Button title="Search" onPress={() => {}} />
      </View>


      <View style={styles.content}>
      <Button title="Logout" onPress={handleLogout} />
        <Text style={styles.welcomeText}>Welcome to MovieTime!</Text>
        <Text>{name}</Text>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: "15%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '500',
  },
});

export default Home;
