import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FS from "expo-file-system";

export default function App() {
  const [image, setImage] = useState(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [showResponseText, setShowResponseText] = useState(false);


  // pickImage prompts the user to select an image from the camera roll.
  // Asks and handles permissions.
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, 
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        setShowSubmitButton(true);
        setShowResponseText(false);
      }

    } catch (error) {
      console.log('Error while choosing an image:', error);
    }
  };

  // Function to send stored image to the server.
  // Response will be the prediction.
  toServer = async () => {
    let url = "";
    let schema = "http://";
    let host = "127.0.0.1";  // iOS feedback
    //host = "10.0.2.2";  // Android feedback
    host = "192.168.0.18";  // local home router
    //host = '172.20.10.5';  // mobile tether
    let route = "/image";
    let port = "5000";
    let content_type = "image/jpeg";
    url = schema + host + ":" + port + route;

    console.log('Attempting to send data to ' + url);
    let response = FS.uploadAsync(url, image, {
      headers: {
        "content-type": content_type,
      },
      httpMethod: "POST",
      uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    }).then((data) => {
      // Log response.
      console.log(data.headers);
      console.log(data.body);
      // Store and show prediction text.
      setResponseText(data.body);
      setShowResponseText(true); 
    })
    .catch((error) => {
      console.error('error:', error.message);
    })
    
  };


  // Display choose image button, image, submit button, and response text.
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Choose image</Text>
      </TouchableOpacity>

      <Text>Crop the image so the bird</Text>
      <Text>fills ~75% of the square.</Text>
      
      {image && (  // Only view image if there is an image set.
        <View>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      {showSubmitButton && (
        <TouchableOpacity onPress={toServer} style={styles.button}>
          <Text style={styles.buttonText}>Predict!</Text>
        </TouchableOpacity>
      )}

      {showResponseText && (
        // React component to return both <Text> tags at once.
        <>
          <Text>We think this might be a...</Text>
          <Text>{responseText}</Text>
        </>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bfbfbf',
  },
  button: {
    backgroundColor: 'grey',  // Dark colour scheme.
    color: '#ffffff',
    borderColor: '#3b3b3b',
    borderWidth: 0,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,  // Margins introduce space between elements.
    marginBottom: 20,
  },
  image: {
    width: 224,
    height: 224,
    marginTop: 20,
    borderRadius: 10,  // Border radius to keep consistent.
  },
  buttonText: {
    color: '#ffffff',
  },
});