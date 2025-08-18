//This screen allows users to set up player names for a golf game, check for saved games, and start or continue games.
// It uses AsyncStorage to manage saved game data and provides functionality to enter player names, start a new game, continue saved games, and delete saved games.
// It also dynamically builds save keys based on the selected course and player initials, ensuring that saved games are organized by course and player initials.
// Enhanced with React Native Paper components for a beautiful Material Design interface.
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Chip, 
  Divider, 
  Surface,
  IconButton,
  useTheme 
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function PlayerSetupScreen({ navigation, route }) {
  const [players, setPlayers] = useState(['', '', '', '']);
  const [hasGame1, setHasGame1] = useState(false);
  const [hasGame2, setHasGame2] = useState(false);
  const theme = useTheme();

  // Get the selected course data (local only now)
  const courseKey = route.params?.courseKey || 'unknown';
  const courseData = route.params?.courseData;
  
  // Handle missing course data
  if (!courseData) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Surface style={styles.errorCard} elevation={4}>
          <Text variant="headlineSmall" style={[styles.errorText, { color: theme.colors.error }]}>
            Course data not found
          </Text>
          <Text variant="bodyMedium" style={[styles.errorSubtext, { color: theme.colors.onSurfaceVariant }]}>
            Please go back and select a course again.
          </Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.errorButton}>
            Go Back
          </Button>
        </Surface>
      </View>
    );
  }
  
  const course = courseData;
  const courseInitials = course?.name?.substring(0, 2).toUpperCase() || 'XX'; 

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
    console.log('Starting new game with course:', course?.name);
    console.log('Course data:', courseData);
    
    const game1 = await AsyncStorage.getItem(GAME1_KEY);
    const game2 = await AsyncStorage.getItem(GAME2_KEY);

    if (game1 && game2) {
      Alert.alert(
        'Cannot Start New Game',
        `You already have two saved games for ${course?.name || 'this course'}. Please delete one before starting a new game.`
      );
      return;
    }

    // Filter out empty player names
    const filteredPlayers = players.filter(name => name.trim() !== '');
    if (filteredPlayers.length === 0) {
      Alert.alert('Please enter at least one player name.');
      return;
    }

    const saveKey = !game1 ? GAME1_KEY : GAME2_KEY;// if game1 exists, use game2 key
    
    try {
      // Save the game with player names and empty scores
      await AsyncStorage.setItem(
        saveKey,
        JSON.stringify({ players: filteredPlayers, scores: filteredPlayers.map(() => Array(18).fill('')), courseKey })
      );
      
      console.log('Navigating to Scorecard with:', { saveKey, courseKey, courseData: courseData?.name });
      navigation.navigate('Scorecard', { saveKey, courseKey, courseData });
    } catch (error) {
      console.error('Error saving game:', error);
      Alert.alert('Error', 'Failed to save game. Please try again.');
    }
  };

  // Handle continuing a saved game for this course
  const handleContinue = (saveKey) => {
    console.log('Continuing game with saveKey:', saveKey);
    console.log('Course data for continue:', courseData?.name);
    navigation.navigate('Scorecard', { saveKey, courseKey, courseData });
  };

  // Handle deleting a saved game for this course
  const handleDelete = (saveKey) => {
    const doDelete = async () => {
      await AsyncStorage.removeItem(saveKey);
      setHasGame1(!!(await AsyncStorage.getItem(GAME1_KEY)));
      setHasGame2(!!(await AsyncStorage.getItem(GAME2_KEY)));
    };

    Alert.alert(
      'Delete Saved Game',
      'Are you sure you want to delete this saved game? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Course Info Header */}
      <Surface style={styles.courseHeader} elevation={4}>
        <View style={styles.courseHeaderContent}>
          <IconButton icon="golf" iconColor={theme.colors.primary} size={32} />
          <View style={styles.courseInfo}>
            <Text variant="headlineSmall" style={[styles.courseName, { color: theme.colors.primary }]}>
              {course?.name || 'Unknown Course'}
            </Text>
            <View style={styles.courseStats}>
              <Chip icon="flag" compact style={styles.courseChip}>
                Par {course?.preview?.par || course?.pars?.reduce((sum, par) => sum + par, 0)}
              </Chip>
              <Chip icon="ruler" compact style={styles.courseChip}>
                {(course?.preview?.yardage || course?.yardages?.reduce((sum, yardage) => sum + yardage, 0))?.toLocaleString()} yds
              </Chip>
            </View>
          </View>
        </View>
      </Surface>

      {/* Player Setup */}
      <Card style={styles.playersCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Player Setup
          </Text>
          <Text variant="bodyMedium" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Enter names for up to 4 players
          </Text>
          
          <View style={styles.playersInput}>
            {players.map((player, idx) => (
              <TextInput
                key={idx}
                mode="outlined"
                label={`Player ${idx + 1}`}
                value={player}
                onChangeText={text => handleChange(text, idx)}
                style={styles.playerInput}
                left={<TextInput.Icon icon="account" />}
              />
            ))}
          </View>
          
          <Button
            mode="contained"
            onPress={handlePlayGolf}
            icon="golf-tee"
            style={styles.newGameButton}
            contentStyle={styles.newGameButtonContent}
          >
            Start New Game
          </Button>
        </Card.Content>
      </Card>

      {/* Saved Games */}
      {(hasGame1 || hasGame2) && (
        <Card style={styles.savedGamesCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Saved Games
            </Text>
            <Text variant="bodyMedium" style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Continue or delete existing games for this course
            </Text>
            
            <Divider style={styles.divider} />
            
            {hasGame1 && (
              <View style={styles.savedGameItem}>
                <Text variant="bodyLarge" style={styles.savedGameTitle}>Saved Game 1</Text>
                <View style={styles.savedGameActions}>
                  <Button
                    mode="contained-tonal"
                    onPress={() => handleContinue(GAME1_KEY)}
                    icon="play"
                    style={styles.continueButton}
                  >
                    Continue
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleDelete(GAME1_KEY)}
                    icon="delete"
                    style={styles.deleteButton}
                    textColor={theme.colors.error}
                  >
                    Delete
                  </Button>
                </View>
              </View>
            )}
            
            {hasGame2 && (
              <View style={styles.savedGameItem}>
                <Text variant="bodyLarge" style={styles.savedGameTitle}>Saved Game 2</Text>
                <View style={styles.savedGameActions}>
                  <Button
                    mode="contained-tonal"
                    onPress={() => handleContinue(GAME2_KEY)}
                    icon="play"
                    style={styles.continueButton}
                  >
                    Continue
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleDelete(GAME2_KEY)}
                    icon="delete"
                    style={styles.deleteButton}
                    textColor={theme.colors.error}
                  >
                    Delete
                  </Button>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  courseHeader: {
    marginBottom: 20,
    borderRadius: 12,
  },
  courseHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  courseName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 8,
  },
  courseChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  playersCard: {
    marginBottom: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: 20,
  },
  playersInput: {
    gap: 12,
    marginBottom: 24,
  },
  playerInput: {
    backgroundColor: 'transparent',
  },
  newGameButton: {
    paddingVertical: 4,
    borderRadius: 8,
  },
  newGameButtonContent: {
    paddingVertical: 8,
  },
  savedGamesCard: {
    borderRadius: 12,
  },
  divider: {
    marginVertical: 16,
  },
  savedGameItem: {
    paddingVertical: 12,
  },
  savedGameTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  savedGameActions: {
    flexDirection: 'row',
    gap: 12,
  },
  continueButton: {
    flex: 1,
    borderRadius: 8,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#d32f2f',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  errorSubtext: {
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    borderRadius: 8,
  },
});