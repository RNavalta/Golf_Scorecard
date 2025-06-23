import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function PlayerSetupScreen({ navigation }) {
//   const [players, setPlayers] = useState(['', '', '', '']);

const STORAGE_KEY = 'golf_scorecard_state';

export default function PlayerSetupScreen({ navigation }) {
  const [players, setPlayers] = useState(['', '', '', '']);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    // Check if a saved game exists
    const checkSavedGame = async () => {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setHasSavedGame(!!value);
    };
    checkSavedGame();
  }, []);
  
  const handleChange = (text, idx) => {
    const newPlayers = [...players];
    newPlayers[idx] = text;
    setPlayers(newPlayers);
  };

  // Function to handle starting a new game
  const handlePlayGolf = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY); // Clear saved game
    const filteredPlayers = players.filter(name => name.trim() !== '');
    navigation.navigate('Scorecard', { players: filteredPlayers });
  };

//Load saved game and continue
  const handleContinue = () => {
  navigation.navigate('Scorecard');
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Player Names </Text>
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
      {hasSavedGame && (
        <View style={{ marginTop: 12 }}>
          <Button title="Continue Saved Game" onPress={handleContinue} color="#388e3c" />
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