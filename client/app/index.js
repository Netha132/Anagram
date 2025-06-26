import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const navigation = useNavigation();

  const goToDetails = () => {
    navigation.navigate('Details'); // ✅ Use screen name, not file name like 'Details.tsx'
  };

  return (
    <ImageBackground
      source={require('../assets/images/Asset 1.png')}
      style={styles.background}
       resizeMode="contain"
    >
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={goToDetails}>
          <Image
            source={require('../assets/images/Asset 2.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width:"100%",
    height:"100%",
  
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonImage: {
      resizeMode: 'contain',
    width: 150,
    height: 150,
    marginTop: "280%",
  },
});
