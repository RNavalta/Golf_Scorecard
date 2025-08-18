//This is the main entry point for the 3UnderGolf app, which sets up the navigation structure using React Navigation.
// It imports necessary components and screens, and defines the navigation stack for the app.
// It uses a native stack navigator to manage the different screens of the app, including Home,
// CourseSelection, PlayerSetup, and Scorecard screens.
// This structure allows users to navigate through the app seamlessly, starting from the home screen and moving
// through course selection, player setup, and finally to the scorecard screen where they can track their game scores.
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme, configureFonts } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import CourseSelectionScreen from './screens/CourseSelectionScreen';
import PlayerSetupScreen from './screens/PlayerSetupScreen';
import ScorecardScreen from './screens/ScorecardScreen';

const Stack = createNativeStackNavigator();

// Golf-themed color palette
const golfTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32', // Golf course green
    primaryContainer: '#A5D6A7', // Light green
    secondary: '#8BC34A', // Grass green
    secondaryContainer: '#DCEDC8', // Very light green
    tertiary: '#FF9800', // Golf ball orange
    tertiaryContainer: '#FFE0B2', // Light orange
    surface: '#F1F8E9', // Very light green surface
    surfaceVariant: '#E8F5E8', // Light green variant
    background: '#FAFAFA', // Clean white background
    error: '#D32F2F', // Red for errors
    onPrimary: '#FFFFFF', // White text on green
    onSurface: '#1B5E20', // Dark green text
    onBackground: '#2E7D32', // Golf green text
    outline: '#81C784', // Green outline
    scrim: '#000000',
  },
  fonts: configureFonts({
    config: {
      displayLarge: {
        fontWeight: '600',
        fontSize: 28,
      },
      headlineMedium: {
        fontWeight: '500',
        fontSize: 24,
      },
      titleLarge: {
        fontWeight: '500',
        fontSize: 20,
      },
      bodyLarge: {
        fontWeight: '400',
        fontSize: 16,
      },
    }
  }),
};

export default function App() {
  return (
    <PaperProvider theme={golfTheme}>
      <StatusBar style="auto" backgroundColor={golfTheme.colors.primary} />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: golfTheme.colors.primary,
            },
            headerTintColor: golfTheme.colors.onPrimary,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: '3 Under Golf',
              headerStyle: {
                backgroundColor: golfTheme.colors.primary,
              }
            }} 
          />
          <Stack.Screen 
            name="CourseSelection" 
            component={CourseSelectionScreen} 
            options={{ 
              title: 'Select Course',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="PlayerSetup" 
            component={PlayerSetupScreen} 
            options={{ 
              title: 'Setup Players',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="Scorecard" 
            component={ScorecardScreen} 
            options={{ 
              title: 'Scorecard',
              headerShown: true,
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}