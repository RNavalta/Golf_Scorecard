import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from 'react-native';

const PARS = [3,3,3,3,3,3,3,3,4, 4,3,3,3,4,3,3,3,4];
const WHITE_YARDAGES = [162, 166, 111, 162, 154, 140, 137, 120, 259, 273, 200, 154, 164, 218, 87, 176, 134, 340];

const CELL_WIDTH = 48; //width of each hole cell
const NAME_WIDTH = 120; //width of player name cell
const TOTAL_WIDTH = 60; //width of total score cell

export default function ScorecardScreen({ route, navigation }) {
  const saveKey = route.params?.saveKey;
  const [players, setPlayers] = useState(['', '', '', '']);
  const [scores, setScores] = useState([
    Array(18).fill(''),
    Array(18).fill(''),
    Array(18).fill(''),
    Array(18).fill(''),
  ]);

  // Load saved state on mount
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

  const saveGame = async () => {
    if (!saveKey) return;
    try {
      await AsyncStorage.setItem(
        saveKey,
        JSON.stringify({ players, scores })
      );
    } catch (e) {
      console.log('Error saving game:', e);
    }
  };

  // Load saved game state from AsyncStorage
  // If saveKey is provided, it will load the game with that key
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

  // Function to handle score changes
  // This updates the scores array when a score is changed
  const handleScoreChange = (playerIdx, holeIdx, value) => {
    const newScores = scores.map(arr => [...arr]);
    newScores[playerIdx][holeIdx] = value.replace(/[^0-9]/g, '');
    setScores(newScores);
  };

  const getTotal = (arr, start, end) =>
    arr.slice(start, end).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

  // Function to get initials from a name
  const getInitials = name =>
  name
    .split(' ')
    .map(word => word[0]?.toUpperCase())
    .join('');

  // Function to determine the skins winner for each hole
  const getSkinsWinners = () => {
    return PARS.map((_, holeIdx) => {
      // Gather all scores for this hole
      const holeScores = scores.map(playerScores => parseInt(playerScores[holeIdx]) || null);
      // Find the lowest score (ignoring empty)
      const minScore = Math.min(...holeScores.filter(s => s !== null && !isNaN(s)));
      // Count how many players have this score
      const winners = holeScores
        .map((score, idx) => (score === minScore ? idx : null))
        .filter(idx => idx !== null);
      // If only one player has the lowest score, return their initials
      if (winners.length === 1) {
        return getInitials(players[winners[0]]);
      }
      // Otherwise, no skin
      return '';
      });
    };

  const skinsWinners = getSkinsWinners();

  return (
    <SafeAreaView style={styles.safeArea}>  
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
      {/*Use TouchableWithoutFeedback to let users tap anywhere to dismiss the keyboard*/}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView horizontal>
          <ScrollView style={{ maxHeight: '100%' }}>
            <View style={styles.outerContainer}>
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
                {/* Empty cells for F9, B9, Total */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  outerContainer: {
    marginLeft: 12, // Add left margin so the first column is not hidden
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