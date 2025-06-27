//This is the main entry point for the 3UnderGolf app, which sets up the navigation structure using React Navigation.
// It imports necessary components and screens, and defines the navigation stack for the app.
// It uses a native stack navigator to manage the different screens of the app, including Home,
// CourseSelection, PlayerSetup, and Scorecard screens.
// This structure allows users to navigate through the app seamlessly, starting from the home screen and moving
// through course selection, player setup, and finally to the scorecard screen where they can track their game scores.
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CourseSelectionScreen from './screens/CourseSelectionScreen';
import PlayerSetupScreen from './screens/PlayerSetupScreen';
import ScorecardScreen from './screens/ScorecardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CourseSelection" component={CourseSelectionScreen} />
        <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} />
        <Stack.Screen name="Scorecard" component={ScorecardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}