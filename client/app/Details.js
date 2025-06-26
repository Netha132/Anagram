// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ImageBackground,
// } from 'react-native';

// export default function FormPage() {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState({
//     fullName: '',
//     companyName: '',
//     jobTitle: '',
//     email: '',
//     contact: '',
//   });

//   const [error, setError] = useState(false);

//   const validate = () => {
//     const { fullName, companyName, jobTitle, email, contact } = formData;
//     const isEmailValid = email.endsWith('@gmail.com');
//     const isContactValid = /^[0-9]{10}$/.test(contact);
//     return fullName && companyName && jobTitle && isEmailValid && isContactValid;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       setError(false);
//       navigation.navigate('Round1', { formData }); // <-- Passing data to Round1
//     } else {
//       setError(true);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/images/Asset 3.png')}
//       style={styles.background}
//       resizeMode="contain"
//     >
//       <View style={styles.formBox}>
//         <TextInput
//           style={[styles.input, {marginTop: 10}]} 
          
//           placeholder="Enter Your Full Name"
//           // placeholderTextColor="#999"
//           onChangeText={(text) => setFormData({ ...formData, fullName: text })}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Your Company Name"
//           // placeholderTextColor="#999"
//           onChangeText={(text) => setFormData({ ...formData, companyName: text })}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Your Job Title"
//           // placeholderTextColor="#999"
//           onChangeText={(text) => setFormData({ ...formData, jobTitle: text })}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Your E-mail"
//           // placeholderTextColor="#999"
//           keyboardType="email-address"
//           onChangeText={(text) => setFormData({ ...formData, email: text })}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Your Contact Number"
//           // placeholderTextColor="#999"
//           keyboardType="numeric"
//           maxLength={10}
//           onChangeText={(text) => setFormData({ ...formData, contact: text })}
//         />

//         {error && <Text style={styles.errorText}>Invalid data entered!!!</Text>}

//         <TouchableOpacity onPress={handleSubmit}>
//           <Image
//             source={require('../assets/images/Asset 2.png')}
//             style={styles.image}
//           />
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   formBox: {
//     padding: 25,
//     marginTop: 175,
//     width: '40%',
//     alignItems: 'center',
//   },
//   input: {
//     width: '61%',
//     padding:10,
//     // paddingBottom:8,
//     // paddingTop:10,
//     // height:'40%',
//     marginVertical: 9,
//     marginLeft: '163%',
//     fontSize: 14,
//     // marginTop:12,
//     // borderColor:'none',
//     // alignSelf: 'center',
//   },
//   errorText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     marginLeft: '235%',
//     width: '100%',
//   },
//   image: {
//     marginTop: 20,
//     width: 100,
//     height: 40,
//     resizeMode: 'contain',
//     marginLeft: 900,
//   },
// });


import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

export default function FormPage() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    jobTitle: '',
    email: '',
    contact: '',
  });

  const [error, setError] = useState('');

  const validate = () => {
    const { fullName, companyName, jobTitle, email, contact } = formData;
    
    if (!fullName) return 'Full name is required';
    if (!companyName) return 'Company name is required';
    if (!jobTitle) return 'Job title is required';
    
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) return 'Please enter a valid email';
    
    const isContactValid = /^[0-9]{10}$/.test(contact);
    if (!isContactValid) return 'Phone number must be 10 digits';
    
    return '';
  };

  const handleSubmit = () => {
    const validationError = validate();
    if (!validationError) {
      setError('');
      navigation.navigate('Round1', { formData });
    } else {
      setError(validationError);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/Asset 3.png')}
      style={styles.background}
      resizeMode="contain"
    >
      <View style={styles.container}>
        <View style={styles.formBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Full Name"
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Company Name"
            onChangeText={(text) => setFormData({ ...formData, companyName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Job Title"
            onChangeText={(text) => setFormData({ ...formData, jobTitle: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Your E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Contact Number"
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) => setFormData({ ...formData, contact: text })}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.button}>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Image
                source={require('../assets/images/Asset 2.png')}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  formBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
    marginTop: 55,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '75%',
    padding: 8,
    marginVertical: 5,
    // borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    // backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    width: '100%',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: "6%",
  },
  image: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
});
