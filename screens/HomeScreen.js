//The home screen of the app, which displays the title and a button to navigate to the course selection screen.
// This screen serves as the entry point for users to start their golf game by selecting a course
// Enhanced with React Native Paper components for a beautiful Material Design interface.
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Surface, 
  Divider, 
  Chip,
  useTheme 
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();

  const features = [
    { icon: 'golf', title: 'Course Selection', subtitle: 'Real golf courses near you' },
    { icon: 'account-group', title: 'Multiple Players', subtitle: 'Track scores for your group' },
    { icon: 'chart-line', title: 'Score Tracking', subtitle: 'Hole-by-hole scoring' },
    { icon: 'history', title: 'Game History', subtitle: 'Save and review past games' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section */}
      <Surface style={[styles.heroSection, { backgroundColor: theme.colors.primaryContainer }]} elevation={4}>
        <View style={styles.heroContent}>
          <Text variant="displayMedium" style={[styles.appTitle, { color: theme.colors.primary }]}>
            3 Under
          </Text>
          <Text variant="displaySmall" style={[styles.appSubtitle, { color: theme.colors.onPrimaryContainer }]}>
            Golf Scorecard
          </Text>
          <Text variant="bodyLarge" style={[styles.tagline, { color: theme.colors.onPrimaryContainer }]}>
            Track your golf game with real course data
          </Text>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CourseSelection')}
            icon="golf-tee"
            style={styles.startButton}
            contentStyle={styles.startButtonContent}
            labelStyle={styles.startButtonLabel}
          >
            Start New Game
          </Button>
        </View>
      </Surface>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text variant="headlineSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Features
        </Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard} mode="outlined">
              <Card.Content style={styles.featureContent}>
                <View style={styles.featureHeader}>
                  <Chip icon={feature.icon} compact style={styles.featureIcon}>
                    {feature.title}
                  </Chip>
                </View>
                <Text variant="bodyMedium" style={styles.featureSubtitle}>
                  {feature.subtitle}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Golf Course Database
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                500+
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Golf Courses
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
                Real
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Course Data
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                Live
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Updates
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Additional Actions */}
      <View style={styles.actionsSection}>
        <Button
          mode="outlined"
          icon="history"
          onPress={() => {/* Navigate to history when implemented */}}
          style={styles.actionButton}
        >
          View Game History
        </Button>
        
        <Button
          mode="text"
          icon="cog"
          onPress={() => {/* Navigate to settings when implemented */}}
          style={styles.actionButton}
        >
          Settings
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  heroSection: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroContent: {
    padding: 32,
    alignItems: 'center',
  },
  appTitle: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtitle: {
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  startButton: {
    borderRadius: 25,
    paddingHorizontal: 16,
  },
  startButtonContent: {
    paddingVertical: 8,
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  featuresSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  featureContent: {
    padding: 16,
  },
  featureHeader: {
    marginBottom: 8,
  },
  featureIcon: {
    alignSelf: 'flex-start',
  },
  featureSubtitle: {
    opacity: 0.7,
  },
  statsCard: {
    margin: 16,
    borderRadius: 12,
  },
  divider: {
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  actionsSection: {
    padding: 16,
    gap: 8,
    marginBottom: 32,
  },
  actionButton: {
    marginVertical: 4,
  },
});