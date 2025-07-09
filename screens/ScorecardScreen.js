import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { COURSES } from '../data/courses';

export default function ScorecardScreen({ route, navigation }) {
  // Get courseKey and saveKey from navigation params
  const courseKey = route.params?.courseKey || 'course1';
  const saveKey = route.params?.saveKey;

  // Get course data
  const course = COURSES[courseKey];
  const PARS = course.pars;
  const WHITE_YARDAGES = course.yardages;

  const [players, setPlayers] = useState(['', '', '', '']);
  const [scores, setScores] = useState([
    Array(18).fill(''),
    Array(18).fill(''),
    Array(18).fill(''),
    Array(18).fill(''),
  ]);

  // Lock orientation and load game on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    loadGame();
    return () => {
      ScreenOrientation.unlockAsync();
    };
    // eslint-disable-next-line
  }, []);

  // Save state whenever players or scores change
  useEffect(() => {
    saveGame();
    // eslint-disable-next-line
  }, [players, scores]);

  // Save game state to AsyncStorage
  //So that the score card can be resumed later
  //This is useful for long games where you might want to take a break and come back
  //navigating back to the scorecard screen will load the saved game
  //and allow you to continue where you left off
  const saveGame = async () => {
    if (!saveKey) return;
    try {
      await AsyncStorage.setItem(
        saveKey,
        JSON.stringify({ players, scores, courseKey })
      );
    } catch (e) {
      console.log('Error saving game:', e);
    }
  };

  // Load saved game state from AsyncStorage
  const loadGame = async () => {
    if (!saveKey) return;
    try {
      const value = await AsyncStorage.getItem(saveKey);
      if (value !== null) {
        const saved = JSON.parse(value);
        setPlayers(saved.players);
        setScores(saved.scores);
      }
    } catch (e) {
      console.log('Error loading game:', e);
    }
  };

  // Handle score changes
  const handleScoreChange = (playerIdx, holeIdx, value) => {
    const newScores = scores.map(arr => [...arr]);
    newScores[playerIdx][holeIdx] = value.replace(/[^0-9]/g, '');
    setScores(newScores);
  };

  // Calculate total score for a player
  const getTotal = (arr, start, end) =>
    arr.slice(start, end).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

  // Get initials from a name
  const getInitials = name =>
    name
      .split(' ')
      .map(word => word[0]?.toUpperCase())
      .join('');

  // Determine skins winners for each hole
  const getSkinsWinners = () => {
    return PARS.map((_, holeIdx) => {
      const holeScores = scores.map(playerScores => parseInt(playerScores[holeIdx]) || null);
      const minScore = Math.min(...holeScores.filter(s => s !== null && !isNaN(s)));
      const winners = holeScores
        .map((score, idx) => (score === minScore ? idx : null))
        .filter(idx => idx !== null);
      if (winners.length === 1) {
        return getInitials(players[winners[0]]);
      }
      return '';
    });
  };

  // Get skins winners for the current game
  const skinsWinners = getSkinsWinners();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView horizontal>
            <ScrollView style={{ maxHeight: '100%' }}>
              <View style={styles.outerContainer}>
                {/* Show course name */}
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: 8}}>
                  {course.name}
                </Text>
                {/* Header Row: Hole Numbers */}
                <View style={styles.row}>
                  <Text style={[styles.headerLeft, { width: NAME_WIDTH }]}>Tee</Text>
                  {PARS.map((_, holeIdx) => (
                    <Text key={holeIdx} style={[styles.header, { width: CELL_WIDTH }]}>{holeIdx + 1}</Text>
                  ))}
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>F9</Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>B9</Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>Total</Text>
                </View>
                {/* White Yardage Row */}
                <View style={styles.row}>
                  <Text style={[styles.headerLeft, { width: NAME_WIDTH }]}>White</Text>
                  {WHITE_YARDAGES.map((yard, idx) => (
                    <Text key={idx} style={[styles.yardage, { width: CELL_WIDTH }]}>{yard}</Text>
                  ))}
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                    {WHITE_YARDAGES.slice(0,9).reduce((a,b)=>a+b,0)}
                  </Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                    {WHITE_YARDAGES.slice(9,18).reduce((a,b)=>a+b,0)}
                  </Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                    {WHITE_YARDAGES.reduce((a,b)=>a+b,0)}
                  </Text>
                </View>
                {/* Par Row */}
                <View style={styles.row}>
                  <Text style={[styles.headerLeft, { width: NAME_WIDTH }]}>Par</Text>
                  {PARS.map((par, idx) => (
                    <Text key={idx} style={[styles.par, { width: CELL_WIDTH }]}>{par}</Text>
                  ))}
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                    {PARS.slice(0,9).reduce((a,b)=>a+b,0)}
                  </Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                    {PARS.slice(9,18).reduce((a,b)=>a+b,0)}
                  </Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                    {PARS.reduce((a,b)=>a+b,0)}
                  </Text>
                </View>
                {/* Player Rows */}
                {players.map((player, playerIdx) => (
                  <View key={playerIdx} style={styles.row}>
                    <TextInput
                      style={[styles.playerName, { width: NAME_WIDTH }]}
                      value={player}
                      onChangeText={text => {
                        const newPlayers = [...players];
                        newPlayers[playerIdx] = text;
                        setPlayers(newPlayers);
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      placeholder={`Player ${playerIdx + 1}`}
                    />
                    {PARS.map((_, holeIdx) => (
                      <TextInput
                        key={holeIdx}
                        style={[styles.input, { width: CELL_WIDTH }]}
                        keyboardType="numeric"
                        value={scores[playerIdx][holeIdx]}
                        onChangeText={text => handleScoreChange(playerIdx, holeIdx, text)}
                        maxLength={2}
                      />
                    ))}
                    <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                      {getTotal(scores[playerIdx], 0, 9)}
                    </Text>
                    <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                      {getTotal(scores[playerIdx], 9, 18)}
                    </Text>
                    <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>
                      {getTotal(scores[playerIdx], 0, 18)}
                    </Text>
                  </View>
                ))}
                {/* Skins Row */}
                <View style={styles.row}>
                  <Text style={[styles.headerLeft, { width: NAME_WIDTH }]}>Skins</Text>
                  {skinsWinners.map((initials, idx) => (
                    <Text key={idx} style={[styles.skins, { width: CELL_WIDTH }]}>
                      {initials}
                    </Text>
                  ))}
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}></Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}></Text>
                  <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}></Text>
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Constants for cell widths
const CELL_WIDTH = 48;
const NAME_WIDTH = 120;
const TOTAL_WIDTH = 60;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  outerContainer: {
    marginLeft: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  header: { fontWeight: 'bold', textAlign: 'center', padding: 4, backgroundColor: '#e0e0e0', borderWidth: 1, borderColor: '#ccc' },
  headerLeft: { fontWeight: 'bold', textAlign: 'left', padding: 4, backgroundColor: '#e0e0e0', borderWidth: 1, borderColor: '#ccc' },
  headerTotal: { fontWeight: 'bold', textAlign: 'center', padding: 4, backgroundColor: '#d0ffd0', borderWidth: 1, borderColor: '#ccc' },
  yardage: { textAlign: 'center', padding: 4, backgroundColor: '#fffbe0', borderWidth: 1, borderColor: '#ccc' },
  par: { textAlign: 'center', padding: 4, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ccc' },
  playerName: { fontWeight: 'bold', textAlign: 'left', padding: 4, backgroundColor: '#f0f8ff', borderWidth: 1, borderColor: '#ccc' },
  input: { borderWidth: 1, borderColor: '#ccc', margin: 0, textAlign: 'center', borderRadius: 4, padding: 4, backgroundColor: '#fff' },
  skins: { textAlign: 'center', padding: 4, backgroundColor: '#e0f7fa', borderWidth: 1, borderColor: '#ccc', fontWeight: 'bold', color: '#00796b',},
});