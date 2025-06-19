import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function PlayerSetupScreen({ navigation }) {
  const [players, setPlayers] = useState(['', '', '', '']);

  const handleChange = (text, idx) => {
    const newPlayers = [...players];
    newPlayers[idx] = text;
    setPlayers(newPlayers);
  };

  const handlePlayGolf = () => {
    const filteredPlayers = players.filter(name => name.trim() !== '');
    navigation.navigate('Scorecard', { players: filteredPlayers });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Player Names (max 4)</Text>
      {players.map((player, idx) => (
        <TextInput
          key={idx}
          style={styles.input}
          placeholder={`Player ${idx + 1}`}
          value={player}
          onChangeText={text => handleChange(text, idx)}
        />
      ))}
      <Button title="Play Golf" onPress={handlePlayGolf} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 16 },
  input: { borderWidth: 1, width: 200, margin: 8, padding: 8, borderRadius: 5 },
});