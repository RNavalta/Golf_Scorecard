
// This screen allows users to select a golf course from a list.
// It uses the COURSES data to display available courses and navigates to PlayerSetup with the selected course key.
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { COURSES } from '../data/courses';

export default function CourseSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Golf Course</Text>
      {Object.entries(COURSES).map(([key, course]) => (
        <View key={key} style={styles.courseButton}>
          <Button
            title={course.name}
            onPress={() => navigation.navigate('PlayerSetup', { courseKey: key })} // Navigate to PlayerSetup with the selected course key
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 24 },
  courseButton: { marginVertical: 10, width: 220 },
});
