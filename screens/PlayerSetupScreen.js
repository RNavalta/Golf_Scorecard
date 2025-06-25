import React, { useState, useCallback} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const GAME1_KEY = 'CM_Saved_Game1';
const GAME2_KEY = 'CM_Saved_Game2';

export default function PlayerSetupScreen({ navigation }) {
  const [players, setPlayers] = useState(['', '', '', '']);
  const [hasGame1, setHasGame1] = useState(false);
  const [hasGame2, setHasGame2] = useState(false);  

// Reset players when the screen is focused
// This ensures that the player names are cleared when navigating back to this screen
useFocusEffect(
  React.useCallback(() => {
    setPlayers(['', '', '', '']);
  }, [])
 );

// Check for saved games when the screen is focused
// This ensures that the saved game status is updated when navigating back to this screen
 useFocusEffect(
    useCallback(() => {
      setPlayers(['', '', '', '']);
      const checkGames = async () => {
        setHasGame1(!!(await AsyncStorage.getItem(GAME1_KEY)));
        setHasGame2(!!(await AsyncStorage.getItem(GAME2_KEY)));
      };
      checkGames();
    }, [])
  );
  
  // Function to handle player name changes
  // This updates the players array when a player name is changed
  const handleChange = (text, idx) => {
    const newPlayers = [...players];
    newPlayers[idx] = text;
    setPlayers(newPlayers);
  };

//Function to handle starting a new game
const handlePlayGolf = async () => {
    const game1 = await AsyncStorage.getItem(GAME1_KEY);
    const game2 = await AsyncStorage.getItem(GAME2_KEY);

    if (game1 && game2) {
      Alert.alert(
        'Cannot Start New Game',
        'You already have two saved games. Please delete one before starting a new game.'
      );
      return;
    }

    const filteredPlayers = players.filter(name => name.trim() !== '');
    if (filteredPlayers.length === 0) {
      Alert.alert('Please enter at least one player name.');
      return;
    }

    const saveKey = !game1 ? GAME1_KEY : GAME2_KEY;

    await AsyncStorage.setItem(
      saveKey,
      JSON.stringify({ players: filteredPlayers, scores: filteredPlayers.map(() => Array(18).fill('')) })
    );
    navigation.navigate('Scorecard', { saveKey });
  };

  // Function to handle continuing a saved game
  // This navigates to the Scorecard screen with the saveKey of the selected game
  const handleContinue = (saveKey) => {
    navigation.navigate('Scorecard', { saveKey });
  };

  // Function to handle deleting a saved game
  // This removes the saved game from AsyncStorage and updates the state
  const handleDelete = async (saveKey) => {
    await AsyncStorage.removeItem(saveKey);
    setHasGame1(!!(await AsyncStorage.getItem(GAME1_KEY)));
    setHasGame2(!!(await AsyncStorage.getItem(GAME2_KEY)));
  };

   return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Player Names</Text>
      {players.map((player, idx) => (
        <TextInput
          key={idx}
          style={styles.input}
          placeholder={`Player ${idx + 1}`}
          value={player}
          onChangeText={text => handleChange(text, idx)}
        />
      ))}
      <Button title="New Game" onPress={handlePlayGolf} />
      {hasGame1 && (
        <View style={{ marginTop: 12 }}>
          <Button title="Continue Saved Game 1" onPress={() => handleContinue(GAME1_KEY)} color="#388e3c" />
          <Button title="Delete Saved Game 1" onPress={() => handleDelete(GAME1_KEY)} color="#d32f2f" />
        </View>
      )}
      {hasGame2 && (
        <View style={{ marginTop: 12 }}>
          <Button title="Continue Saved Game 2" onPress={() => handleContinue(GAME2_KEY)} color="#388e3c" />
          <Button title="Delete Saved Game 2" onPress={() => handleDelete(GAME2_KEY)} color="#d32f2f" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, width: 200, margin: 8, padding: 8, borderRadius: 5 },
});

  