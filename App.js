import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1); // 1 for input, 2 for display
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    phone: '',
    selfie: null, 
  });

  const handleInputChange = (name, value) => {
    setUserData({...userData, [name]: value});
  };

  const validateAndNextPage = () => {
    console.log("Validating...");
    console.log("Name:", userData.name);
    console.log("Address:", userData.address);
    console.log("Phone:", userData.phone);
    console.log("Selfie:", userData.selfie);
  
    // check if phone is numeric and fields are not empty
    if (!userData.name) {
      console.log("Name is missing.");
      Alert.alert("Error", "Please enter your name.");
    } else if (!userData.address) {
      console.log("Address is missing.");
      Alert.alert("Error", "Please enter your address.");
    } else if (!userData.phone.match(/^\d+$/)) {
      console.log("Phone number is invalid.");
      Alert.alert("Error", "Phone number must be numeric.");
    } else if (!userData.selfie) {
      console.log("Selfie is missing.");
      Alert.alert("Error", "Please take a selfie.");
    } else {
      console.log("All validations passed. Navigating to page 2.");
      setCurrentPage(2);
    }
  };

  const handleTakeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log("Image Picker Result:", result);
  
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setUserData({...userData, selfie: result.assets[0].uri});
      console.log("Selfie URI Set:", result.assets[0].uri); // Correctly access the URI
    }
  };

  if (currentPage === 1) {
    return (
      <View style={styles.container}>
        {/* Existing Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={userData.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={userData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          keyboardType="numeric"
        />
        <Button title="Take Selfie" onPress={handleTakeSelfie} />
        <Button title="Submit" onPress={validateAndNextPage} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Name: {userData.name}</Text>
        <Text>Address: {userData.address}</Text>
        <Text>Phone: {userData.phone}</Text>
        {/* Display the selfie if it has been captured */}
      {userData.selfie && <Image source={{ uri: userData.selfie }} style={styles.selfie} />}
        <Button title="Back" onPress={() => setCurrentPage(1)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  selfie: {
    width: 200,
    height: 200,
    margin: 20,
  },
});
