//The home screen of the app, which displays the title and a button to navigate to the course selection screen.
// This screen serves as the entry point for users to start their golf game by selecting a course
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>3 Under</Text>
      <Text style={styles.title}>Golf Scorecard</Text>
      <Button
        title="Begin"
        onPress={() => navigation.navigate('CourseSelection')}// Navigate to CourseSelection screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, marginBottom: 24 },
});