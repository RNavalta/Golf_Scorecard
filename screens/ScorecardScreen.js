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
} from 'react-native';

const PARS = [4,4,3,5,4,4,3,5,4, 4,4,3,5,4,4,3,5,4];

const CELL_WIDTH = 48; //width of each hole cell
const NAME_WIDTH = 120; //width of player name cell
const TOTAL_WIDTH = 60; //width of total score cell

export default function ScorecardScreen({ route }) {
  const { players } = route.params;
  const [scores, setScores] = useState(
    players.map(() => Array(18).fill(''))
  );

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); // Lock to landscape mode
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleScoreChange = (playerIdx, holeIdx, value) => {
    const newScores = scores.map(arr => [...arr]);
    newScores[playerIdx][holeIdx] = value.replace(/[^0-9]/g, '');
    setScores(newScores);
  };

  const getTotal = (arr, start, end) =>
    arr.slice(start, end).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea}>  
      {/*Use TouchableWithoutFeedback to let users tap anywhere to dismiss the keyboard*/}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView horizontal>
          <View style={styles.outerContainer}>
            {/* Header Row: Hole Numbers */}
            <View style={styles.row}>
              <Text style={[styles.headerLeft, { width: NAME_WIDTH }]}></Text>
              {PARS.map((_, holeIdx) => (
                <Text key={holeIdx} style={[styles.header, { width: CELL_WIDTH }]}>{holeIdx + 1}</Text>
              ))}
              <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>F9</Text>
              <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>B9</Text>
              <Text style={[styles.headerTotal, { width: TOTAL_WIDTH }]}>Total</Text>
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
                <Text style={[styles.playerName, { width: NAME_WIDTH }]} numberOfLines={1} ellipsizeMode="tail">{player}</Text>
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
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  par: { textAlign: 'center', padding: 4, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ccc' },
  playerName: { fontWeight: 'bold', textAlign: 'left', padding: 4, backgroundColor: '#f0f8ff', borderWidth: 1, borderColor: '#ccc' },
  input: { borderWidth: 1, borderColor: '#ccc', margin: 0, textAlign: 'center', borderRadius: 4, padding: 4, backgroundColor: '#fff' },
});