// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ImageBackground,
//   Image,
// } from 'react-native';
// import Draggable from 'react-native-draggable';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// let rounds = [
//   { word: 'SECURE', answer: 'RESCUE', hint: 'Certain to remain safe and unthreatened' },
//   { word: 'PROGRAMMER', answer: 'MEGAPRORMR', hint: 'A person who writes code' },
//   { word: 'TECHNOLOGY', answer: 'ETHNOLOGYC', hint: 'Used in computers and science' },
//   { word: 'DEVELOPER', answer: 'REDEVELOP', hint: 'Creates software' },
//   { word: 'METALLIC', answer: 'CALLTIME', hint: 'Related to metal' },
//   { word: 'COMMVAULT', answer: 'VAULTCOMM', hint: 'Data protection company' },
// ];

// export default function Round1() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { formData = {} } = route.params || {};
//  const { fullName = 'Guest', companyName = 'Company', jobTitle = '', email = '', contact = '' } = formData;


//   const [round, setRound] = useState(0);
//   const [score, setScore] = useState(0);
//   const [targetWord, setTargetWord] = useState('');
//   const [shuffledLetters, setShuffledLetters] = useState([]);
//   const [userAnswer, setUserAnswer] = useState([]);
//   const [showFinalScreen, setShowFinalScreen] = useState(false);
//   const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
//   const [wrongLetters, setWrongLetters] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [gameCompleted, setGameCompleted] = useState(false);
//   const [showLeaderboard, setShowLeaderboard] = useState(false);
//   const [leaderboardData, setLeaderboardData] = useState([]);

//   const submitScoreToServer = async (playerData) => {
//     try {
//       const response = await fetch('http://YOUR_LOCAL_IP:3001/api/submit-score', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//   fullName: playerData.name,
//   companyName: playerData.company,
//   jobTitle: playerData.jobTitle,
//   score: playerData.score,
//   email: playerData.email,
//   contact: playerData.contact
//   }),
//       });
//       return await response.json();
//     } catch (error) {
//       console.error('Error submitting score:', error);
//       return { error: 'Failed to submit score' };
//     }
//   };

//   const fetchLeaderboard = async () => {
//     try {
//       const response = await fetch(
//         `http://YOUR_LOCAL_IP:3001/api/get-leaderboard?currentPlayer=${fullName}¤tCompany=${companyName}`
//       );
//       const data = await response.json();

//       // --- SOLUTION: De-duplicate the data before setting the state ---
//       // This ensures that if the server accidentally sends the same player twice,
//       // we only keep the first occurrence.
//       const uniqueData = data.filter((player, index, self) =>
//         index === self.findIndex((p) => (
//           p.name === player.name && p.company === player.company
//         ))
//       );
//       // --- END OF SOLUTION ---

//       setLeaderboardData(uniqueData); // Use the de-duplicated data

//     } catch (error) {
//       console.error('Error fetching leaderboard:', error);
//       // Fallback to AsyncStorage
//       const savedScores = await AsyncStorage.getItem('leaderboard');
//       if (savedScores) {
//         // It's good practice to de-duplicate the local data as well, just in case.
//         const parsedScores = JSON.parse(savedScores);
//          const uniqueLocalScores = parsedScores.filter((player, index, self) =>
//           index === self.findIndex((p) => (
//             p.name === player.name && p.company === player.company
//           ))
//         );
//         setLeaderboardData(uniqueLocalScores.sort((a, b) => b.score - a.score));
//       }
//     }
//   };

//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   useEffect(() => {
//     const current = rounds[round];
//     setTargetWord(current.word);
//     const shuffled = current.answer.split('').map((char, index) => ({
//       key: `${index}`,
//       label: char,
//     }));
//     setShuffledLetters(shuffled);
//     setUserAnswer(Array(current.answer.length).fill(null));
//     setShowFinalScreen(false);
//     setIsCorrectAnswer(false);
//     setWrongLetters([]);
//     setIsDragging(false);
//   }, [round]);

//   useEffect(() => {
//     let timer;
//     if (gameCompleted) {
//       timer = setTimeout(() => {
//         setShowLeaderboard(true);
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [gameCompleted]);

//   function handleDrop(draggedItem, dropIndex) {
//     const updatedAnswer = [...userAnswer];
//     updatedAnswer[dropIndex] = draggedItem.label;
//     setUserAnswer(updatedAnswer);
    
//     if (draggedItem.label !== targetWord[dropIndex]) {
//       setWrongLetters([...wrongLetters, dropIndex]);
//     } else {
//       setWrongLetters(wrongLetters.filter(index => index !== dropIndex));
//     }
//     setIsDragging(false);
//   }

//   function handleSubmit() {
//     const formedWord = userAnswer.join('');
//     if (formedWord === rounds[round].word) {
//       setScore(score + 5);
//       setIsCorrectAnswer(true);
//     } else {
//       setIsCorrectAnswer(false);
//     }
//     setShowFinalScreen(true);
    
//     if (round + 1 >= rounds.length) {
//       setGameCompleted(true);
//     }
//   }

//   async function handleNextRound() {
//     if (round + 1 < rounds.length) {
//       setRound(round + 1);
//       setShowFinalScreen(false);
//       setIsCorrectAnswer(false);
//       setUserAnswer([]);
//       setWrongLetters([]);
//     } else {
//       const playerData = {
//   name: fullName,
//   company: companyName,
//   jobTitle: jobTitle,
//   score: score,
//   email,
//   contact
// };

      
//       try {
//         // Save to AsyncStorage
//         const existingScores = await AsyncStorage.getItem('leaderboard');
//         let scores = [];
//         if (existingScores) {
//           scores = JSON.parse(existingScores);
//         }
//         scores.push(playerData);
//         await AsyncStorage.setItem('leaderboard', JSON.stringify(scores));
        
//         // Submit to MongoDB
//         await submitScoreToServer(playerData);
        
//         // Refresh leaderboard
//         await fetchLeaderboard();
        
//         setGameCompleted(true);
//       } catch (error) {
//         console.error('Failed to save score:', error);
//       }
//     }
//   }

//   function handleSkipRound() {
//     handleNextRound();
//   }

//   function handleBackToHome() {
//     navigation.navigate('index');
//   }

//   const getAnswerBoxStyle = (index) => {
//     if (isDragging) {
//       return styles.draggingBox;
//     }
//     if (wrongLetters.includes(index)) {
//       return styles.wrongLetterBox;
//     }
//     if (userAnswer[index] && userAnswer[index] === targetWord[index]) {
//       return styles.correctLetterBox;
//     }
//     return styles.defaultBox;
//   };

//   return (
//     <View style={styles.mainContainer}>
//       {!showFinalScreen ? (
//         <ImageBackground
//           source={require('../assets/images/Asset 13.png')}
//           style={styles.container}
//           resizeMode='contain'
//         >
//           {/* Game screen content */}
//           <View style={styles.topBar}>
//             <View style={styles.playerInfo}>
//               <ImageBackground 
//                 source={require('../assets/images/round.png')}
//                 style={styles.nameBackground}
//                 resizeMode='contain'
//               >
//                 <Text style={styles.playerName}>{fullName}</Text>
//               </ImageBackground>
//               <ImageBackground 
//                 source={require('../assets/images/round.png')}
//                 style={styles.scoreBackground}
//                 resizeMode='contain'
//               >
//                 <Text style={styles.scoreText}>Score: {score}</Text>
//               </ImageBackground>
//             </View>
//             <View style={styles.companyInfo}>
//               <ImageBackground 
//                 source={require('../assets/images/round.png')}
//                 style={styles.companyBackground}
//                 resizeMode='contain'
//               >
//                 <Text style={styles.companyName}>{companyName}</Text>
//               </ImageBackground>
//               <ImageBackground 
//                 source={require('../assets/images/round.png')}
//                 style={styles.roundBackground}
//                 resizeMode='contain'
//               >
//                 <Text style={styles.roundText}>Round: {round + 1}/{rounds.length}</Text>
//               </ImageBackground>
//             </View>
//           </View>

//           <ImageBackground 
//             source={require('../assets/images/hint.png')}
//             style={styles.hintBackground}
//             resizeMode="contain"
//           >
//             <Text style={styles.hintText}>Hint: {rounds[round].hint}</Text>
//           </ImageBackground>

//           <View style={styles.inlineContainer}>
//             <ImageBackground
//               source={require('../assets/images/Asset 10.png')}
//               style={styles.anagramBackground}
//               resizeMode="contain"
//             >
//               <DraggableFlatList
//   horizontal
//   data={shuffledLetters}
//   keyExtractor={(item) => item.key}
//   onDragBegin={() => setIsDragging(true)}
//   onDragEnd={({ data }) => {
//     setShuffledLetters(data);
//     setIsDragging(false);
//   }}
//   renderItem={({ item, drag, isActive }) => (
//     <TouchableOpacity
//       onLongPress={drag}
//       onPress={() => {
//         const index = userAnswer.findIndex((a) => a === null);
//         if (index !== -1) handleDrop(item, index);
//       }}
//       style={[
//         styles.letterBox,
//         isActive && styles.draggingLetterBox, // Highlight item if it's actively being dragged
//       ]}
//     >
//       <Text style={styles.letterText}>{item.label}</Text>
//     </TouchableOpacity>
//   )}
//   renderPlaceholder={({ item }) => (
//     <View style={[styles.letterBox, styles.dragPreview]}>
//       <Text style={styles.letterText}>{item.label}</Text>
//     </View>
//   )}
//   contentContainerStyle={styles.letterRow}
//               />
//               <Text style={styles.anagramText}>is an anagram of</Text>
//             </ImageBackground>
//           </View>

//           <View style={styles.answerContainer}>
//             {userAnswer.map((char, index) => (
//               <View
//                 key={index}
//                 style={[styles.answerBox, getAnswerBoxStyle(index)]}
//               >
//                 <TouchableOpacity
//                   style={styles.answerTouchable}
//                   onPress={() => {
//                     const updatedAnswer = [...userAnswer];
//                     updatedAnswer[index] = null;
//                     setUserAnswer(updatedAnswer);
//                     setWrongLetters(wrongLetters.filter(i => i !== index));
//                   }}
//                 >
//                   <Text style={styles.answerText}>{char || ' '}</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>

//           <View style={styles.bottomButtons}>
//             <ImageBackground 
//               source={require('../assets/images/round.png')}
//               style={styles.skipRoundBackground}
//               resizeMode='contain'
//             >
//               <TouchableOpacity onPress={handleSkipRound} style={styles.skipButton}>
//                 <Text style={styles.buttonText}>Skip Round</Text>
//               </TouchableOpacity>
//             </ImageBackground>
//             <ImageBackground 
//               source={require('../assets/images/round.png')}
//               style={styles.submitBackground}
//               resizeMode='contain'
//             >
//               <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//                 <Text style={styles.buttonText}>Submit Word</Text>
//               </TouchableOpacity>
//             </ImageBackground>
//           </View>
//         </ImageBackground>
//       ) : showLeaderboard ? (
//         <ImageBackground
//   source={require('../assets/images/Asset 33.png')}
//   style={styles.fullScreenBackground}
//   resizeMode='contain'
// >
//   <View style={styles.leaderboardMainContainer}>            
//     <View style={styles.leaderboardEntriesContainer}>
//       {leaderboardData.length > 0 ? (
//         leaderboardData
//           .sort((a, b) => b.score - a.score)
//           .slice(0, 6)
//           .map((player, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.leaderboardEntry,
//                 player.isCurrentPlayer && styles.currentPlayerHighlight
//               ]}
//             >
//               <Text style={styles.leaderboardName}>
//                 {player.name} {player.company && `(${player.company})`}
//               </Text>
//               <Text style={styles.leaderboardScore}>
//                 {player.score}
//               </Text>
//             </View>
//           ))
//       ) : (
//         <Text style={styles.noScoresText}>No scores yet</Text>
//       )}
//     </View>

//     <TouchableOpacity onPress={handleBackToHome} style={styles.homeButton}>
//       <Image
//         source={require('../assets/images/round.png')}
//         style={styles.homeButtonImage}
//         resizeMode='contain'
//       />
//       <Text style={styles.homeButtonText}>Back to Home</Text>
//     </TouchableOpacity>
//   </View>
// </ImageBackground>

//       ) : (
//         <>
//            {isCorrectAnswer && (
//             <Image
//               source={require('../assets/images/Asset 14.png')}
//               style={styles.paperBlast}
//               resizeMode="cover"
//               pointerEvents="none"
//             />
//           )}
          
//           <ImageBackground 
//             source={isCorrectAnswer 
//               ? require('../assets/images/Asset 26.png') 
//               : require('../assets/images/Asset 31.png')}
//             style={styles.fullScreenBackground}
//             resizeMode="contain"
//           >
//             <View style={styles.finalContent}>
//               <Text style={styles.correctName}>{fullName}</Text>
//               <Text style={styles.finalText}>
//                 {rounds[round].answer} is an anagram of {rounds[round].word}
//               </Text>
      
//               <View style={styles.scoreInfo}>
//                 <ImageBackground 
//                   source={require('../assets/images/round.png')}
//                   style={styles.correctScore}
//                   resizeMode='contain'
//                 >
//                   <Text style={styles.resultScore}>Score: {score}</Text>
//                 </ImageBackground>
//                 <ImageBackground 
//                   source={require('../assets/images/round.png')}
//                   style={styles.correctRound}
//                   resizeMode='contain'
//                 >
//                   <Text style={styles.resultRound}>Round: {round + 1}/{rounds.length}</Text>
//                 </ImageBackground>
//               </View>
              
//               {round + 1 < rounds.length && (
//                 <TouchableOpacity onPress={handleNextRound}>
//                   <Image 
//                     source={require('../assets/images/Asset 23.png')}
//                     style={styles.nextButtonImage}
//                     resizeMode='contain'
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </ImageBackground>
//         </>
//       )}
//     </View>
//   );
// }

// // Styles remain the same as in your previous code
// const styles = StyleSheet.create({
//      mainContainer: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   container: { 
//     flex: 1, 
//     padding: 20, 
//     width: '100%', 
//     height: '100%' 
//   },
//   fullScreenBackground: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   nameBackground: {
//     width: 150,
//     height: 100,
//     marginLeft: 150,
//     marginTop: -50,
//   },
//   companyBackground: {
//     width: 150,
//     height: 100,
//     marginRight: 150,
//     marginTop: -50,
//   },
//   scoreBackground: {
//     width: 150,
//     height: 100,
//     marginLeft: 230,
//     marginTop: -30,
//   },
//   roundBackground: {
//     width: 150,
//     height: 100,
//     marginRight: 230,
//     marginTop: -30,
//   },
//   skipRoundBackground: {
//     width: 150,
//     height: 100,
//     marginLeft: 1190,
//     marginBottom: 100,
//     marginRight: -150,
//   },
//   submitBackground: {
//     width: 150,
//     height: 100,
//     marginTop: 60,
//     marginRight: 150,
//   },
//   paperBlast: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     zIndex: 1,
//   },
//   topBar: {
//     flexDirection: 'row', 
//     justifyContent: 'space-between',
//     marginTop: 40, 
//     marginBottom: 20,
//   },
//   playerInfo: { alignItems: 'flex-start' },
//   companyInfo: { alignItems: 'flex-end' },
//   playerName: { 
//     color: 'white', 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     marginTop: 35,
//     marginLeft: 50,
//   },
//   companyName: { 
//     color: '#fff', 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     marginTop: 35,
//     marginLeft: 30,
//   },
//   scoreText: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 35,
//     marginLeft: 50,
//   },
//   roundText: { 
//     color: '#fff', 
//     fontSize: 16,
//     marginTop: 35,
//     marginLeft: 30,
//   },
//   hintBackground: {
//     width: '75%',
//     height: '50%',
//     resizeMode: 'contain',
//     marginLeft: 280,
//     marginTop: -65,
//   },
//   hintText: {
//     fontSize: 26, 
//     fontStyle: 'italic',
//     marginLeft: 120,
//     marginTop: 50,
//   },
//   anagramBackground: {
//     width: "80%",
//     height: '160%', 
//     justifyContent: 'center',
//     alignItems: 'center', 
//     marginRight: 150,
//   },
//   inlineContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 20,
//     width: '100%',
//     marginTop: -150,
//     marginLeft: 150,
//   },
//   anagramText: { 
//     color: '#fff', 
//     fontSize: 18, 
//     fontWeight: 'bold',
//     marginLeft: 250,
//     marginTop: -60,
//   },
//   letterRow: { 
//     paddingVertical: 20,
//     justifyContent: 'center',
//     marginRight: 600,
//   },
//   answerContainer: {
//     flexDirection: 'row', 
//     justifyContent: 'center',
//     flexWrap: 'wrap', 
//     marginVertical: 20,
//     marginTop: 150,
//     marginRight: 250,
//   },
//   answerBox: {
//     width: 50, 
//     height: 50, 
//     margin: 5,
//     justifyContent: 'center', 
//     alignItems: 'center',
//     borderRadius: 8, 
//     elevation: 3,
//   },
//   defaultBox: { 
//     backgroundColor: '#003366',
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
//   draggingBox: { 
//     backgroundColor: '#FF3C6E',
//     borderWidth: 2,
//     borderColor: '#FF3C6E',
//   },

//   draggingLetterBox: {
//   opacity: 0.5,
//   transform: [{ scale: 1.1 }],
//   backgroundColor: '#FFDB58',
//   borderWidth: 1,
//   borderColor: '#FFF',
// },

// dragPreview: {
//   backgroundColor: '#FF3C6E',
//   borderRadius: 8,
//   justifyContent: 'center',
//   alignItems: 'center',
//   minWidth: 40,
//   padding: 15,
//   elevation: 10,
// },

//   wrongLetterBox: { 
//     backgroundColor: '#FFDB58',
//     borderWidth: 1,
//     borderColor: '#FFDB58',
//   },
//   correctLetterBox: {
//     backgroundColor: '#FF3C6E',
//     borderWidth: 1,
//     borderColor: '#FF3C6E',
//   },
//   answerTouchable: {
//     width: '100%', 
//     height: '100%',
//     justifyContent: 'center', 
//     alignItems: 'center',
//   },
//   answerText: { 
//     color: '#fff', 
//     fontSize: 20, 
//     fontWeight: 'bold' 
//   },
//   letterBox: {
//     backgroundColor: '#FF3C6E', 
//     padding: 15, 
//     margin:5,
//     marginLeft: 10,
//     borderRadius: 8, 
//     minWidth: 40, 
//     alignItems: 'center',
//     justifyContent: 'center', 
//     elevation: 3,
//   },
//   letterText: { 
//     color: '#fff', 
//     fontSize: 20, 
//     fontWeight: 'bold' 
//   },
//   bottomButtons: {
//     flexDirection: 'row', 
//     justifyContent: 'space-between',
//     position: 'absolute', 
//     bottom: 20, 
//     right: 20,
//   },
//   submitButton: {
//     paddingVertical: 12, 
//     paddingHorizontal: 25, 
//     borderRadius: 8,
//     marginTop: 25,
//     width: 300,
//   },
//   skipButton: {
//     paddingVertical: 12, 
//     paddingHorizontal: 25, 
//     borderRadius: 8,
//     marginTop: 25,
//   },
//   buttonText: { 
//     color: '#fff', 
//     fontWeight: 'bold', 
//     fontSize: 16 
//   },
//   correctName: {
//     marginTop: 330,
//     color: '#fff', 
//     fontWeight: 'bold', 
//     fontSize: 18, 
//     marginLeft: 740,
//   },
//   resultScore: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 90,
//     marginLeft: 100,
//   },
//   resultRound: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 90,
//     marginLeft: 100,
//   },
//   finalContent: { 
//     width: '80%', 
//   },
//   nextButtonImage: {
//     width: 250,
//     height: 150,
//     marginLeft: 630,
//     marginTop: -110,
//   },
//   finalText: {
//     fontSize: 30, 
//     color: '#fff', 
//     fontWeight: 'bold',
//     textAlign: 'center', 
//     marginTop: 50,
//     marginLeft: 250,
//   },
//   correctScore: {
//     width: 250,
//     height: 200,
//     marginTop: -40,
//     marginLeft: 400,
//   },
//   correctRound: {
//     width: 250,
//     height: 200,
//     marginTop: -40,
//     marginRight: 120,
//   },
//   scoreInfo: {
//     flexDirection: 'row', 
//     justifyContent: 'space-between',
//     width: '100%', 
//     marginVertical: 20,
//   },
//   leaderboardMainContainer: {
//     flex: 1,
//     width: '100%',
//     alignItems: 'center',
//     paddingTop: 50,
//   },
//   leaderboardEntriesContainer: {
//     width: '25%',
//     maxHeight: '60%',
//     backgroundColor: 'rgba(194, 59, 91, 0.94)',
//     borderRadius: 15,
//     padding: 10,
//     marginTop: "10%",
//   },
//   leaderboardEntry: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     marginBottom : 5,
//     marginVertical: 10,
//     borderRadius: 2,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   currentPlayerHighlight: {
//     backgroundColor: 'rgba(255, 60, 110, 0.3)',
//     borderWidth: 1,
//     borderColor: '#FF3C6E',
//   },
//   leaderboardName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     flex: 1,
//   },
//   leaderboardScore: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFDB58',
//     minWidth: 40,
//     textAlign: 'right',
//   },
//   homeButton: {
//     width: 150,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   homeButtonImage: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   homeButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     zIndex: 1,
//   },
//   noScoresText: {
//     fontSize: 18,
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
// }); 



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ImageBackground,
//   Image,
// } from 'react-native';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// let rounds = [
//   { word: 'SECURE', answer: 'RESCUE', hint: 'Certain to remain safe and unthreatened' },
//   { word: 'PROGRAMMER', answer: 'MEGAPRORMR', hint: 'A person who writes code' },
//   { word: 'TECHNOLOGY', answer: 'ETHNOLOGYC', hint: 'Used in computers and science' },
//   { word: 'DEVELOPER', answer: 'REDEVELOP', hint: 'Creates software' },
//   { word: 'METALLIC', answer: 'CALLTIME', hint: 'Related to metal' },
//   { word: 'COMMVAULT', answer: 'VAULTCOMM', hint: 'Data protection company' },
// ];

// const ItemTypes = {
//   LETTER: 'letter',
// };

// const DraggableLetter = ({ letter, index, onDrop }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.LETTER,
//     item: { letter, index },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <TouchableOpacity
//       ref={drag}
//       style={[
//         styles.letterBox,
//         isDragging && styles.draggingLetterBox,
//       ]}
//     >
//       <Text style={styles.letterText}>{letter}</Text>
//     </TouchableOpacity>
//   );
// };

// const AnswerSlot = ({ index, letter, onDrop, onRemove, isWrong }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: ItemTypes.LETTER,
//     drop: (item) => onDrop(index, item),
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <View 
//       ref={drop}
//       style={[
//         styles.answerBox,
//         isOver && styles.dragOverBox,
//         letter ? styles.filledBox : styles.emptyBox,
//         isWrong && styles.wrongLetterBox
//       ]}
//     >
//       {letter ? (
//         <TouchableOpacity
//           style={styles.answerTouchable}
//           onPress={() => onRemove(index)}
//         >
//           <Text style={styles.answerText}>{letter}</Text>
//         </TouchableOpacity>
//       ) : (
//         <Text style={styles.answerPlaceholder}>_</Text>
//       )}
//     </View>
//   );
// };

// const GameScreen = ({ 
//   round, 
//   score, 
//   targetWord, 
//   shuffledLetters, 
//   userAnswer, 
//   onDrop, 
//   onRemove, 
//   onSubmit, 
//   onSkipRound,
//   fullName,
//   companyName,
//   rounds,
//   wrongPositions
// }) => {
//   return (
//     <ImageBackground
//       source={require('../assets/images/Asset 13.png')}
//       style={styles.container}
//       resizeMode='contain'
//     >
//       <View style={styles.topBar}>
//         <View style={styles.playerInfo}>
//           <ImageBackground 
//             source={require('../assets/images/round.png')}
//             style={styles.nameBackground}
//             resizeMode='contain'
//           >
//             <Text style={styles.playerName}>{fullName}</Text>
//           </ImageBackground>
//           <ImageBackground 
//             source={require('../assets/images/round.png')}
//             style={styles.scoreBackground}
//             resizeMode='contain'
//           >
//             <Text style={styles.scoreText}>Score: {score}</Text>
//           </ImageBackground>
//         </View>
//         <View style={styles.companyInfo}>
//           <ImageBackground 
//             source={require('../assets/images/round.png')}
//             style={styles.companyBackground}
//             resizeMode='contain'
//           >
//             <Text style={styles.companyName}>{companyName}</Text>
//           </ImageBackground>
//           <ImageBackground 
//             source={require('../assets/images/round.png')}
//             style={styles.roundBackground}
//             resizeMode='contain'
//           >
//             <Text style={styles.roundText}>Round: {round + 1}/{rounds.length}</Text>
//           </ImageBackground>
//         </View>
//       </View>

//       <ImageBackground 
//         source={require('../assets/images/hint.png')}
//         style={styles.hintBackground}
//         resizeMode="contain"
//       >
//         <Text style={styles.hintText}>Hint: {rounds[round].hint}</Text>
//       </ImageBackground>

//       <View style={styles.inlineContainer}>
//         <ImageBackground
//           source={require('../assets/images/Asset 10.png')}
//           style={styles.anagramBackground}
//           resizeMode="contain"
//         >
//           <View style={styles.letterRow}>
//             {shuffledLetters.map((item, index) => (
//               <DraggableLetter 
//                 key={index} 
//                 letter={item.letter} 
//                 index={index}
//                 onDrop={onDrop}
//               />
//             ))}
//           </View>
//           <Text style={styles.anagramText}>is an anagram of</Text>
//         </ImageBackground>
//       </View>

//       <View style={styles.answerContainer}>
//         {userAnswer.map((letter, index) => (
//           <AnswerSlot
//             key={index}
//             index={index}
//             letter={letter}
//             onDrop={onDrop}
//             onRemove={onRemove}
//             isWrong={wrongPositions.includes(index)}
//           />
//         ))}
//       </View>

//       <View style={styles.bottomButtons}>
//         <ImageBackground 
//           source={require('../assets/images/round.png')}
//           style={styles.skipRoundBackground}
//           resizeMode='contain'
//         >
//           <TouchableOpacity onPress={onSkipRound} style={styles.skipButton}>
//             <Text style={styles.buttonText}>Skip Round</Text>
//           </TouchableOpacity>
//         </ImageBackground>
//         <ImageBackground 
//           source={require('../assets/images/round.png')}
//           style={styles.submitBackground}
//           resizeMode='contain'
//         >
//           <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
//             <Text style={styles.buttonText}>Submit Word</Text>
//           </TouchableOpacity>
//         </ImageBackground>
//       </View>
//     </ImageBackground>
//   );
// };

// const FinalScreen = ({ 
//   isCorrectAnswer, 
//   score, 
//   round, 
//   rounds, 
//   fullName, 
//   onNextRound 
// }) => {
//   return (
//     <>
//       {isCorrectAnswer && (
//         <Image
//           source={require('../assets/images/Asset 14.png')}
//           style={styles.paperBlast}
//           resizeMode="cover"
//           pointerEvents="none"
//         />
//       )}
      
//       <ImageBackground 
//         source={isCorrectAnswer 
//           ? require('../assets/images/Asset 26.png') 
//           : require('../assets/images/Asset 31.png')}
//         style={styles.fullScreenBackground}
//         resizeMode="contain"
//       >
//         <View style={styles.finalContent}>
//           <Text style={styles.correctName}>{fullName}</Text>
//           <Text style={styles.finalText}>
//             {rounds[round].answer} is an anagram of {rounds[round].word}
//           </Text>
  
//           <View style={styles.scoreInfo}>
//             <ImageBackground 
//               source={require('../assets/images/round.png')}
//               style={styles.correctScore}
//               resizeMode='contain'
//             >
//               <Text style={styles.resultScore}>Score: {score}</Text>
//             </ImageBackground>
//             <ImageBackground 
//               source={require('../assets/images/round.png')}
//               style={styles.correctRound}
//               resizeMode='contain'
//             >
//               <Text style={styles.resultRound}>Round: {round + 1}/{rounds.length}</Text>
//             </ImageBackground>
//           </View>
          
//           {round + 1 < rounds.length && (
//             <TouchableOpacity onPress={onNextRound}>
//               <Image 
//                 source={require('../assets/images/Asset 23.png')}
//                 style={styles.nextButtonImage}
//                 resizeMode='contain'
//               />
//             </TouchableOpacity>
//           )}
//         </View>
//       </ImageBackground>
//     </>
//   );
// };

// const LeaderboardScreen = ({ leaderboardData, onBackToHome }) => {
//   return (
//     <ImageBackground
//       source={require('../assets/images/Asset 33.png')}
//       style={styles.fullScreenBackground}
//       resizeMode='contain'
//     >
//       <View style={styles.leaderboardMainContainer}>            
//         <View style={styles.leaderboardEntriesContainer}>
//           {leaderboardData.length > 0 ? (
//             leaderboardData
//               .sort((a, b) => b.score - a.score)
//               .slice(0, 6)
//               .map((player, index) => (
//                 <View
//                   key={index}
//                   style={[
//                     styles.leaderboardEntry,
//                     player.isCurrentPlayer && styles.currentPlayerHighlight
//                   ]}
//                 >
//                   <Text style={styles.leaderboardName}>
//                     {player.name} {player.company && `(${player.company})`}
//                   </Text>
//                   <Text style={styles.leaderboardScore}>
//                     {player.score}
//                   </Text>
//                 </View>
//               ))
//           ) : (
//             <Text style={styles.noScoresText}>No scores yet</Text>
//           )}
//         </View>

//         <TouchableOpacity onPress={onBackToHome} style={styles.homeButton}>
//           <Image
//             source={require('../assets/images/round.png')}
//             style={styles.homeButtonImage}
//             resizeMode='contain'
//           />
//           <Text style={styles.homeButtonText}>Back to Home</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// };

// const Round1 = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { formData = {} } = route.params || {};
//   const { fullName = 'Guest', companyName = 'Company', jobTitle = '', email = '', contact = '' } = formData;

//   const [round, setRound] = useState(0);
//   const [score, setScore] = useState(0);
//   const [targetWord, setTargetWord] = useState('');
//   const [shuffledLetters, setShuffledLetters] = useState([]);
//   const [userAnswer, setUserAnswer] = useState([]);
//   const [showFinalScreen, setShowFinalScreen] = useState(false);
//   const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
//   const [wrongPositions, setWrongPositions] = useState([]);
//   const [gameCompleted, setGameCompleted] = useState(false);
//   const [showLeaderboard, setShowLeaderboard] = useState(false);
//   const [leaderboardData, setLeaderboardData] = useState([]);

//   const submitScoreToServer = async (playerData) => {
//     try {
//       const response = await fetch('http://YOUR_LOCAL_IP:3001/api/submit-score', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fullName: playerData.name,
//           companyName: playerData.company,
//           jobTitle: playerData.jobTitle,
//           score: playerData.score,
//           email: playerData.email,
//           contact: playerData.contact
//         }),
//       });
//       return await response.json();
//     } catch (error) {
//       console.error('Error submitting score:', error);
//       return { error: 'Failed to submit score' };
//     }
//   };

//   const fetchLeaderboard = async () => {
//     try {
//       const response = await fetch(
//         `http://YOUR_LOCAL_IP:3001/api/get-leaderboard?currentPlayer=${fullName}&currentCompany=${companyName}`
//       );
//       const data = await response.json();

//       const uniqueData = data.filter((player, index, self) =>
//         index === self.findIndex((p) => (
//           p.name === player.name && p.company === player.company
//         ))
//       );
//       setLeaderboardData(uniqueData);

//     } catch (error) {
//       console.error('Error fetching leaderboard:', error);
//       const savedScores = await AsyncStorage.getItem('leaderboard');
//       if (savedScores) {
//         const parsedScores = JSON.parse(savedScores);
//         const uniqueLocalScores = parsedScores.filter((player, index, self) =>
//           index === self.findIndex((p) => (
//             p.name === player.name && p.company === player.company
//           ))
//         );
//         setLeaderboardData(uniqueLocalScores.sort((a, b) => b.score - a.score));
//       }
//     }
//   };

//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   useEffect(() => {
//     const current = rounds[round];
//     setTargetWord(current.word);
//     const shuffled = current.answer.split('').map((char, index) => ({
//       id: `${index}`,
//       letter: char,
//     }));
//     setShuffledLetters(shuffled);
//     setUserAnswer(Array(current.answer.length).fill(null));
//     setShowFinalScreen(false);
//     setIsCorrectAnswer(false);
//     setWrongPositions([]);
//   }, [round]);

//   useEffect(() => {
//     let timer;
//     if (gameCompleted) {
//       timer = setTimeout(() => {
//         setShowLeaderboard(true);
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [gameCompleted]);

//   const handleDrop = (dropIndex, draggedItem) => {
//     const updatedAnswer = [...userAnswer];
//     const correctLetter = rounds[round].word[dropIndex];
//     const isCorrect = draggedItem.letter === correctLetter;
    
//     updatedAnswer[dropIndex] = draggedItem.letter;
//     setUserAnswer(updatedAnswer);
    
//     if (!isCorrect) {
//       setWrongPositions([...new Set([...wrongPositions, dropIndex])]);
//     } else {
//       setWrongPositions(wrongPositions.filter(pos => pos !== dropIndex));
//     }
//   };

//   const handleRemoveLetter = (index) => {
//     const updatedAnswer = [...userAnswer];
//     updatedAnswer[index] = null;
//     setUserAnswer(updatedAnswer);
//     setWrongPositions(wrongPositions.filter(pos => pos !== index));
//   };

//   const handleSubmit = () => {
//     const formedWord = userAnswer.join('');
//     if (formedWord === rounds[round].word) {
//       setScore(score + 5);
//       setIsCorrectAnswer(true);
//     } else {
//       setIsCorrectAnswer(false);
//     }
//     setShowFinalScreen(true);
    
//     if (round + 1 >= rounds.length) {
//       setGameCompleted(true);
//     }
//   };

//   const handleNextRound = async () => {
//     if (round + 1 < rounds.length) {
//       setRound(round + 1);
//       setShowFinalScreen(false);
//       setIsCorrectAnswer(false);
//       setUserAnswer([]);
//       setWrongPositions([]);
//     } else {
//       const playerData = {
//         name: fullName,
//         company: companyName,
//         jobTitle: jobTitle,
//         score: score,
//         email,
//         contact
//       };
      
//       try {
//         const existingScores = await AsyncStorage.getItem('leaderboard');
//         let scores = [];
//         if (existingScores) {
//           scores = JSON.parse(existingScores);
//         }
//         scores.push(playerData);
//         await AsyncStorage.setItem('leaderboard', JSON.stringify(scores));
        
//         await submitScoreToServer(playerData);
//         await fetchLeaderboard();
        
//         setGameCompleted(true);
//       } catch (error) {
//         console.error('Failed to save score:', error);
//       }
//     }
//   };

//   const handleSkipRound = () => {
//     handleNextRound();
//   };

//   const handleBackToHome = () => {
//     navigation.navigate('index');
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <View style={styles.mainContainer}>
//         {!showFinalScreen ? (
//           <GameScreen
//             round={round}
//             score={score}
//             targetWord={targetWord}
//             shuffledLetters={shuffledLetters}
//             userAnswer={userAnswer}
//             onDrop={handleDrop}
//             onRemove={handleRemoveLetter}
//             onSubmit={handleSubmit}
//             onSkipRound={handleSkipRound}
//             fullName={fullName}
//             companyName={companyName}
//             rounds={rounds}
//             wrongPositions={wrongPositions}
//           />
//         ) : showLeaderboard ? (
//           <LeaderboardScreen 
//             leaderboardData={leaderboardData} 
//             onBackToHome={handleBackToHome} 
//           />
//         ) : (
//           <FinalScreen
//             isCorrectAnswer={isCorrectAnswer}
//             score={score}
//             round={round}
//             rounds={rounds}
//             fullName={fullName}
//             onNextRound={handleNextRound}
//           />
//         )}
//       </View>
//     </DndProvider>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   container: { 
//     flex: 1, 
//     padding: 20, 
//     width: '100%', 
//     height: '100%' 
//   },
//   fullScreenBackground: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   nameBackground: {
//     width: 150,
//     height: 100,
//     marginLeft: 150,
//     marginTop: -50,
//   },
//   companyBackground: {
//     width: 150,
//     height: 100,
//     marginRight: 150,
//     marginTop: -50,
//   },
//   scoreBackground: {
//     width: 150,
//     height: 100,
//     marginLeft: 230,
//     marginTop: -30,
//   },
//   roundBackground: {
//     width: 150,
//     height: 100,
//     marginRight: 230,
//     marginTop: -30,
//   },
//   skipRoundBackground: {
//     width: 150,
//     height: 100,
//     marginLeft: 1190,
//     marginBottom: 100,
//     marginRight: -150,
//   },
//   submitBackground: {
//     width: 150,
//     height: 100,
//     marginTop: 60,
//     marginRight: 150,
//   },
//   paperBlast: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     zIndex: 1,
//   },
//   topBar: {
//     flexDirection: 'row', 
//     justifyContent: 'space-between',
//     marginTop: 40, 
//     marginBottom: 20,
//   },
//   playerInfo: { alignItems: 'flex-start' },
//   companyInfo: { alignItems: 'flex-end' },
//   playerName: { 
//     color: 'white', 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     marginTop: 35,
//     marginLeft: 50,
//   },
//   companyName: { 
//     color: '#fff', 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     marginTop: 35,
//     marginLeft: 30,
//   },
//   scoreText: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 35,
//     marginLeft: 50,
//   },
//   roundText: { 
//     color: '#fff', 
//     fontSize: 16,
//     marginTop: 35,
//     marginLeft: 30,
//   },
//   hintBackground: {
//     width: '75%',
//     height: '50%',
//     resizeMode: 'contain',
//     marginLeft: 280,
//     marginTop: -65,
//   },
//   hintText: {
//     fontSize: 26, 
//     fontStyle: 'italic',
//     marginLeft: 120,
//     marginTop: 50,
//   },
//   anagramBackground: {
//     width: "80%",
//     height: '160%', 
//     justifyContent: 'center',
//     alignItems: 'center', 
//     marginRight: 150,
//   },
//   inlineContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 20,
//     width: '100%',
//     marginTop: -150,
//     marginLeft: 150,
//   },
//   anagramText: { 
//     color: '#fff', 
//     fontSize: 18, 
//     fontWeight: 'bold',
//     marginLeft: 250,
//     marginTop: -60,
//   },
//   letterRow: { 
//     flexDirection: 'row',
//     paddingVertical: 20,
//     justifyContent: 'center',
//     marginRight: 600,
//   },
//   answerContainer: {
//     flexDirection: 'row', 
//     justifyContent: 'center',
//     flexWrap: 'wrap', 
//     marginVertical: 20,
//     marginTop: 50,
//     marginRight: 250,
//   },
//   answerBox: {
//     width: 50, 
//     height: 50, 
//     margin: 5,
//     justifyContent: 'center', 
//     alignItems: 'center',
//     borderRadius: 5, 
//     borderWidth: 2,
//   },
//   emptyBox: { 
//     borderColor: '#FFFFFF',
//     backgroundColor: 'transparent',
//   },
//   filledBox: { 
//     backgroundColor: '#FF3C6E',
//     borderColor: '#FF3C6E',
//   },
//   dragOverBox: {
//     backgroundColor: 'rgba(255, 60, 110, 0.3)',
//     borderColor: '#FF3C6E',
//   },
//   wrongLetterBox: {
//     backgroundColor: '#FFDB58',
//     borderColor: '#FFDB58',
//   },
//   answerText: { 
//     color: '#fff', 
//     fontSize: 24, 
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   answerPlaceholder: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: -5,
//   },
//   letterBox: {
//     backgroundColor: '#FF3C6E', 
//     padding: 15, 
//     margin:5,
//     marginLeft: 10,
//     borderRadius: 8, 
//     minWidth: 40, 
//     alignItems: 'center',
//     justifyContent: 'center', 
//     elevation: 3,
//   },
//   draggingLetterBox: {
//     opacity: 0.5,
//     transform: [{ scale: 1.1 }],
//     backgroundColor: '#FFDB58',
//     borderWidth: 1,
//     borderColor: '#FFF',
//   },
//   letterText: { 
//     color: '#fff', 
//     fontSize: 20, 
//     fontWeight: 'bold' 
//   },
//   bottomButtons: {
//     flexDirection: 'row', 
//     justifyContent: 'space-between',
//     position: 'absolute', 
//     bottom: 20, 
//     right: 20,
//   },
//   submitButton: {
//     paddingVertical: 12, 
//     paddingHorizontal: 25, 
//     borderRadius: 8,
//     marginTop: 25,
//     width: 300,
//   },
//   skipButton: {
//     paddingVertical: 12, 
//     paddingHorizontal: 25, 
//     borderRadius: 8,
//     marginTop: 25,
//   },
//   buttonText: { 
//     color: '#fff', 
//     fontWeight: 'bold', 
//     fontSize: 16 
//   },
//   correctName: {
//     marginTop: 330,
//     color: '#fff', 
//     fontWeight: 'bold', 
//     fontSize: 18, 
//     marginLeft: 740,
//   },
//   resultScore: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 90,
//     marginLeft: 100,
//   },
//   resultRound: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 90,
//     marginLeft: 100,
//   },
//   finalContent: { 
//     width: '80%', 
//   },
//   nextButtonImage: {
//     width: 250,
//     height: 150,
//     marginLeft: 630,
//     marginTop: -110,
//   },
//   finalText: {
//     fontSize: 30, 
//     color: '#fff', 
//     fontWeight: 'bold',
//     textAlign: 'center', 
//     marginTop: 50,
//     marginLeft: 250,
//   },
//   correctScore: {
//     width: 250,
//     height: 200,
//     marginTop: -40,
//     marginLeft: 400,
//   },
//   correctRound: {
//     width: 250,
//     height: 200,
//     marginTop: -40,
//     marginRight: 120,
//   },
//   scoreInfo: {
//     flexDirection: 'row', 
//     justifyContent: 'space-between',
//     width: '100%', 
//     marginVertical: 20,
//   },
//   leaderboardMainContainer: {
//     flex: 1,
//     width: '100%',
//     alignItems: 'center',
//     paddingTop: 50,
//   },
//   leaderboardEntriesContainer: {
//     width: '25%',
//     maxHeight: '60%',
//     backgroundColor: 'rgba(194, 59, 91, 0.94)',
//     borderRadius: 15,
//     padding: 10,
//     marginTop: "10%",
//   },
//   leaderboardEntry: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     marginBottom : 5,
//     marginVertical: 10,
//     borderRadius: 2,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   currentPlayerHighlight: {
//     backgroundColor: 'rgba(255, 60, 110, 0.3)',
//     borderWidth: 1,
//     borderColor: '#FF3C6E',
//   },
//   leaderboardName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     flex: 1,
//   },
//   leaderboardScore: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFDB58',
//     minWidth: 40,
//     textAlign: 'right',
//   },
//   homeButton: {
//     width: 150,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   homeButtonImage: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   homeButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     zIndex: 1,
//   },
//   noScoresText: {
//     fontSize: 18,
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
// });

// export default Round1;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRoute, useNavigation } from '@react-navigation/native';

const rounds = [
  { word: 'SECURE', answer: 'RESCUE', hint: 'Certain to remain safe and unthreatened' },
  { word: 'PROGRAMMER', answer: 'MEGAPRORMR', hint: 'A person who writes code' },
  { word: 'TECHNOLOGY', answer: 'ETHNOLOGYC', hint: 'Used in computers and science' },
  { word: 'DEVELOPER', answer: 'REDEVELOP', hint: 'Creates software' },
  { word: 'METALLIC', answer: 'CALLTIME', hint: 'Related to metal' },
  { word: 'COMMVAULT', answer: 'VAULTCOM', hint: 'Data protection company' },
  { word: 'DATA', answer: 'TADA', hint: 'Related to information' },
  { word: 'PROTECT', answer: 'COPTTER', hint: 'To guard something valuable' },
];

const ItemTypes = {
  LETTER: 'letter',
};

const DraggableLetter = ({ letter, index, isUsed, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LETTER,
    item: { letter, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <View style={isDragging ? styles.draggingContainer : styles.letterContainer}>
      <TouchableOpacity
        ref={drag}
        style={[
          styles.letterBox,
          isUsed && styles.usedLetterBox,
          isDragging && styles.draggingLetterBox,
        ]}
        disabled={isUsed}
      >
        <Text style={styles.letterText}>{letter}</Text>
      </TouchableOpacity>
    </View>
  );
};

const AnswerSlot = ({ index, letter, onDrop, onRemove, isWrong }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.LETTER,
    drop: (item) => onDrop(index, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <View 
      ref={drop}
      style={[
        styles.answerBox,
        isOver && styles.dragOverBox,
        letter ? styles.filledBox : styles.emptyBox,
        isWrong && styles.wrongLetterBox
      ]}
    >
      {letter ? (
        <TouchableOpacity
          style={styles.answerTouchable}
          onPress={() => onRemove(index)}
        >
          <Text style={styles.answerText}>{letter}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.answerPlaceholder}>_</Text>
      )}
    </View>
  );
};

const Round1 = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { formData = {} } = route.params || {};
  const { fullName = 'Guest', companyName = 'Company' } = formData;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showWrongLetters, setShowWrongLetters] = useState(false);
  const [usedLetters, setUsedLetters] = useState([]);

  useEffect(() => {
    setRound(0);
    setScore(0);
    setGameCompleted(false);
    setShowFinalScreen(false);
    setShowWrongLetters(false);
  }, []);

  useEffect(() => {
    const current = rounds[round];
    setTargetWord(current.word);
    const shuffled = current.answer.split('').map((char, index) => ({
      key: `${index}`,
      letter: char,
      isUsed: false,
    }));
    setShuffledLetters(shuffled);
    setUserAnswer(Array(current.word.length).fill(null));
    setShowFinalScreen(false);
    setIsCorrectAnswer(false);
    setWrongLetters([]);
    setIsDragging(false);
    setShowWrongLetters(false);
    setUsedLetters([]);
  }, [round]);

  useEffect(() => {
    let timer;
    if (gameCompleted) {
      submitScore();
      timer = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Leaderboard' }],
        });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [gameCompleted]);

  const submitScore = async () => {
    try {
      const response = await fetch('http://192.168.1.2:3001/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, companyName, score }),
      });

      if (!response.ok) throw new Error('Failed to submit score');
      const data = await response.json();
      console.log('Score submitted:', data);
      navigation.navigate('Leaderboard', {
        currentPlayerData: { name: fullName, company: companyName, score },
      });
    } catch (error) {
      Alert.alert('Error', 'Could not submit score.');
      console.error('Submission error:', error);
    }
  };

  const handleDrop = (dropIndex, draggedItem) => {
    const updatedAnswer = [...userAnswer];
    
    // Only allow dropping if the slot is empty and letter isn't already used
    if (!updatedAnswer[dropIndex] && !usedLetters.includes(draggedItem.index)) {
      updatedAnswer[dropIndex] = draggedItem.letter;
      setUserAnswer(updatedAnswer);
      setUsedLetters([...usedLetters, draggedItem.index]);
      
      // Update the shuffled letters to mark this one as used
      setShuffledLetters(prev => prev.map((item, idx) => 
        idx === draggedItem.index ? {...item, isUsed: true} : item
      ));
      
      // Check if the letter is in the correct position
      const correctLetter = rounds[round].word[dropIndex];
      const isCorrect = draggedItem.letter === correctLetter;
      
      if (!isCorrect) {
        setWrongLetters([...new Set([...wrongLetters, dropIndex])]);
      } else {
        setWrongLetters(wrongLetters.filter(pos => pos !== dropIndex));
      }
    }
  };

  const handleRemoveLetter = (index) => {
    const updatedAnswer = [...userAnswer];
    const letterToRemove = updatedAnswer[index];
    
    if (letterToRemove) {
      // Find the original index of this letter in the shuffled letters
      const removedLetterIndex = shuffledLetters.findIndex(
        item => item.letter === letterToRemove && item.isUsed
      );
      
      updatedAnswer[index] = null;
      setUserAnswer(updatedAnswer);
      setWrongLetters(wrongLetters.filter(i => i !== index));
      
      if (removedLetterIndex !== -1) {
        setUsedLetters(usedLetters.filter(i => i !== removedLetterIndex));
        // Update the shuffled letters to mark this one as not used
        setShuffledLetters(prev => prev.map((item, idx) => 
          idx === removedLetterIndex ? {...item, isUsed: false} : item
        ));
      }
    }
  };

  const handleSubmit = () => {
    const formedWord = userAnswer.join('');
    const wrongIndices = [];
    
    // Check which letters are wrong
    for (let i = 0; i < formedWord.length; i++) {
      if (formedWord[i] !== targetWord[i]) {
        wrongIndices.push(i);
      }
    }
    
    setWrongLetters(wrongIndices);
    setShowWrongLetters(true);
    
    // After showing wrong letters for 1 second, proceed to results
    setTimeout(() => {
      if (formedWord === rounds[round].word) {
        setScore(score + 5);
        setIsCorrectAnswer(true);
      } else {
        setIsCorrectAnswer(false);
      }
      
      setShowFinalScreen(true);
      setShowWrongLetters(false);

      if (round + 1 >= rounds.length) {
        setGameCompleted(true);
      }
    }, 1000);
  };

  const handleNextRound = () => {
    if (round + 1 < rounds.length) {
      setRound(round + 1);
    } else {
      setGameCompleted(true);
      submitScore();
    }
  };

  const handleSkipRound = () => {
    setIsCorrectAnswer(false);
    setShowFinalScreen(true);
    setShowWrongLetters(false);

    if (round + 1 >= rounds.length) {
      setGameCompleted(true);
    }
  };

  const getAnswerBoxStyle = (index) => {
    if (isDragging) return styles.draggingBox;
    if (showWrongLetters && wrongLetters.includes(index)) return styles.wrongLetterBox;
    if (userAnswer[index]) return styles.filledBox;
    return styles.emptyBox;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <View style={styles.mainContainer}>
        {!showFinalScreen ? (
          <ImageBackground
            source={require('../assets/images/Asset 13.png')}
            style={styles.container}
            resizeMode='contain'
          >
            <View style={styles.topBar}>
              <View style={styles.playerInfo}>
                <ImageBackground source={require('../assets/images/round.png')} style={styles.nameBackground} resizeMode='contain'>
                  <Text style={styles.playerName}>{fullName}</Text>
                </ImageBackground>
                <ImageBackground source={require('../assets/images/round.png')} style={styles.scoreBackground} resizeMode='contain'>
                  <Text style={styles.scoreText}>Score: {score}</Text>
                </ImageBackground>
              </View>
              <View style={styles.companyInfo}>
                <ImageBackground source={require('../assets/images/round.png')} style={styles.companyBackground} resizeMode='contain'>
                  <Text style={styles.companyName}>{companyName}</Text>
                </ImageBackground>
                <ImageBackground source={require('../assets/images/round.png')} style={styles.roundBackground} resizeMode='contain'>
                  <Text style={styles.roundText}>Round: {round + 1}/{rounds.length}</Text>
                </ImageBackground>
              </View>
            </View>

            <ImageBackground source={require('../assets/images/hint.png')} style={styles.hintBackground} resizeMode="contain">
              <Text style={styles.hintText}>Hint: {rounds[round].hint}</Text>
            </ImageBackground>

            <View style={styles.inlineContainer}>
              <View style={styles.anagramBackground}>
                <ImageBackground source={require('../assets/images/Asset 10.png')} style={styles.anagramBackground} resizeMode="cover">
                  <View style={styles.letterRow}>
                    {shuffledLetters.map((item, index) => (
                      <DraggableLetter 
                        key={index} 
                        letter={item.letter} 
                        index={index}
                        isUsed={item.isUsed}
                        onDrop={handleDrop}
                      />
                    ))}
                  </View>
                  <Text style={styles.anagramText}>is an anagram of</Text>
                </ImageBackground>
              </View>
            </View>

            <View style={styles.answerContainer}>
              {userAnswer.map((char, index) => (
                <AnswerSlot
                  key={index}
                  index={index}
                  letter={char}
                  onDrop={handleDrop}
                  onRemove={handleRemoveLetter}
                  isWrong={wrongLetters.includes(index)}
                />
              ))}
            </View>

            <View style={styles.bottomButtons}>
              <ImageBackground source={require('../assets/images/round.png')} style={styles.skipRoundBackground} resizeMode='contain'>
                <TouchableOpacity onPress={handleSkipRound} style={styles.skipButton}>
                  <Text style={styles.buttonText}>Skip Round</Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground source={require('../assets/images/round.png')} style={styles.submitBackground} resizeMode='contain'>
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <Text style={styles.buttonText}>Submit Word</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </ImageBackground>
        ) : (
          <>
            {isCorrectAnswer && (
              <Image source={require('../assets/images/Asset 14.png')} style={styles.paperBlast} resizeMode="cover" pointerEvents="none" />
            )}
            <ImageBackground source={isCorrectAnswer ? require('../assets/images/Asset 26.png') : require('../assets/images/Asset 31.png')} style={styles.fullScreenBackground} resizeMode="contain">
              <View style={styles.finalContent}>
                <Text style={styles.correctName}>{fullName}</Text>
                <Text style={styles.finalText}>{rounds[round].answer} is an anagram of {rounds[round].word}</Text>
                <View style={styles.scoreInfo}>
                  <ImageBackground source={require('../assets/images/round.png')} style={styles.correctScore} resizeMode='contain'>
                    <Text style={styles.resultScore}>Score: {score}</Text>
                  </ImageBackground>
                  <ImageBackground source={require('../assets/images/round.png')} style={styles.correctRound} resizeMode='contain'>
                    <Text style={styles.resultRound}>Round: {round + 1}/{rounds.length}</Text>
                  </ImageBackground>
                </View>
                {round + 1 < rounds.length && (
                  <TouchableOpacity onPress={handleNextRound}>
                    <Image source={require('../assets/images/Asset 23.png')} style={styles.nextButtonImage} resizeMode='contain' />
                  </TouchableOpacity>
                )}
              </View>
            </ImageBackground>
          </>
        )}
      </View>
    </DndProvider>
  );
};

const styles = StyleSheet.create({
  // ... (keep all styles exactly the same as before)
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { 
    flex: 1, 
    padding: 20, 
    width: '100%', 
    height: '100%' 
  },
  fullScreenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  nameBackground:{
   width:150,
   height:100,
   marginLeft:150,
   marginTop:-80,
  },
  companyBackground:{
    width:150,
    height:100,
    marginRight:150,
    marginTop:-80,
  },
  scoreBackground:{
    width:150,
    height:100,
    marginLeft:230,
    marginTop:-30,
  },
  roundBackground:{
    width:150,
    height:100,
    marginRight:230,
    marginTop:-30,
  },
  skipRoundBackground:{
    width:150,
    height:100,
    marginLeft:1190,
    marginBottom:100,
    marginRight:-150,
  },
  submitBackground:{
    width:150,
    height:100,
    marginTop:60,
    marginRight:150,
  },
  paperBlast: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 40, 
    marginBottom: 20,
  },
  playerInfo: { alignItems: 'flex-start' },
  companyInfo: { alignItems: 'flex-end' },
  playerName: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop:35,
    marginLeft:50,
  },
  companyName: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop:35,
    marginLeft:30,
  },
  scoreText: {
    color: '#fff',
    fontSize: 16,
    marginTop:35,
    marginLeft:50,
  },
  roundText: { 
    color: '#fff', 
    fontSize: 16,
    marginTop:35,
    marginLeft:30,
  },
  hintBackground: {
    width:'80%',
    height:'50%',
    resizeMode:'contain',
    marginLeft:230,
    marginTop:-65,
    
  },
  hintText: {
    fontSize: 26, 
    marginLeft:120,
    marginTop:50,
  },
  anagramBackground: {
    width:"90%",
    height:'140%', 
    justifyContent: 'center',
    alignItems: 'center', 
    marginRight:150,
    borderCurve:100,
  },
  inlineContainer: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width:'100%',
    marginTop:-140,
    marginLeft:200,
  },
  anagramText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    marginLeft: 450, 
    marginTop:-60,
  },
  letterContainer: {
    opacity: 1,
  },
  draggingContainer: {
    opacity: 1,
  },
  letterRow: { 
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'center',
    marginRight: 350, 
    marginBotoom:100,
  },
  answerContainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    flexWrap: 'wrap', 
    marginVertical: 20,
    marginTop:100,
    marginRight:300,
  },
  answerBox: {
    width: 50, 
    height: 50, 
    margin: 5,
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 8, 
    elevation: 3,
  },
  emptyBox: { 
    backgroundColor: '#052438',
    borderWidth: 1,
    borderColor: 'transparent',
    borderColor:'navyblue',
    borderRadius:10,
  },
  filledBox: {
    backgroundColor: '#FF3C6E',
    borderWidth: 2,
    borderColor: '#FF3C6E',
  },
  dragOverBox: {
    backgroundColor: 'rgba(255, 60, 110, 0.3)',
    borderWidth: 2,
    borderColor: '#FF3C6E',
  },
  wrongLetterBox: { 
    backgroundColor: '#B38E3E',
    borderWidth: 1,
    borderColor: '#FFDB58',
  },
  answerTouchable: {
    width: '100%', 
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  answerText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  letterBox: {
    backgroundColor: '#FF4E6A', 
    padding: 15, 
    margin: 5,
    borderRadius: 8, 
    minWidth: 50, 
    alignItems: 'center',
    justifyContent: 'center', 
    elevation: 3,
  },
  usedLetterBox: {
    opacity: 0.3,
    backgroundColor: '#ccc',
  },
  draggingLetterBox: {
    opacity: 0.8,
    transform: [{ scale: 1.1 }],
    backgroundColor: '#FFDB58',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  letterText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  bottomButtons: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    position: 'absolute', 
    bottom: 20, 
    right: 20,
  },
  submitButton: {
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 8,
    marginTop:25,
    width:300,
  },
  skipButton: {
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 8,
    marginTop:25,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  correctName:{
    marginTop:275,
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18, 
    paddingBottom: 20,
    marginLeft:620,
  },
  resultScore:{
    color: '#fff',
    fontSize: 16,
    marginTop:90,
    marginLeft:60,
  },
  resultRound:{
    color: '#fff',
    fontSize: 16,
    marginTop:90,
    marginLeft:60,
  },
  finalContent: { 
    width: '80%', 
  },
  finalText:{
   color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 25,
    marginLeft:450,
    marginBottom:100,
  },
  nextButtonImage:{
    width:250,
    height:150,
    marginLeft:500,
    marginTop:-120,
  },
  correctScore:{
    width:200,
    height:200,
    marginTop:-160,
    marginLeft:350,
  },
  correctRound:{
    width:200,
    height:200,
    marginTop:-160,
    marginRight:120,
  },
  scoreInfo: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '100%', 
    marginVertical: 20,
  },
});

export default Round1;