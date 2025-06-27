import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { COURSES } from '../data/courses';

export default function PlayerSetupScreen({ navigation, route }) {
  const [players, setPlayers] = useState(['', '', '', '']);
  const [hasGame1, setHasGame1] = useState(false);
  const [hasGame2, setHasGame2] = useState(false);

  // Get the selected course key and initials
  const courseKey = route.params?.courseKey || 'course1';
  const courseInitials = COURSES[courseKey]?.initials || 'XX';

  // Build save keys using initials and course key
  const GAME1_KEY = `${courseInitials}_Saved_Game1_${courseKey}`;
  const GAME2_KEY = `${courseInitials}_Saved_Game2_${courseKey}`;

  // Reset players and check for saved games for this course when focused
  useFocusEffect(
    useCallback(() => {
      setPlayers(['', '', '', '']);
      const checkGames = async () => {
        setHasGame1(!!(await AsyncStorage.getItem(GAME1_KEY)));
        setHasGame2(!!(await AsyncStorage.getItem(GAME2_KEY)));
      };
      checkGames();
    }, [GAME1_KEY, GAME2_KEY])
  );

  // Handle player name changes
  const handleChange = (text, idx) => {
    const newPlayers = [...players];
    newPlayers[idx] = text;
    setPlayers(newPlayers);
  };

  // Handle starting a new game for this course
  const handlePlayGolf = async () => {
    const game1 = await AsyncStorage.getItem(GAME1_KEY);
    const game2 = await AsyncStorage.getItem(GAME2_KEY);

    if (game1 && game2) {
      Alert.alert(
        'Cannot Start New Game',
        `You already have two saved games for ${COURSES[courseKey]?.name}. Please delete one before starting a new game.`
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
      JSON.stringify({ players: filteredPlayers, scores: filteredPlayers.map(() => Array(18).fill('')), courseKey })
    );
    navigation.navigate('Scorecard', { saveKey, courseKey });
  };

  // Handle continuing a saved game for this course
  const handleContinue = (saveKey) => {
    navigation.navigate('Scorecard', { saveKey, courseKey });
  };

  // Handle deleting a saved game for this course
  const handleDelete = async (saveKey) => {
    await AsyncStorage.removeItem(saveKey);
    setHasGame1(!!(await AsyncStorage.getItem(GAME1_KEY)));
    setHasGame2(!!(await AsyncStorage.getItem(GAME2_KEY)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Player Names</Text>
      <Text style={styles.courseName}>
        Course: {COURSES[courseKey]?.name || 'Unknown'}
      </Text>
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
  title: { fontSize: 24, marginBottom: 8 },
  courseName: { fontSize: 18, marginBottom: 16, color: '#00796b' },
  input: { borderWidth: 1, width: 200, margin: 8, padding: 8, borderRadius: 5 },
});