
// This screen allows users to select a golf course from a list.
// It now uses local course data for testing the React Native Paper UI components.
// Enhanced with React Native Paper components for a beautiful Material Design interface.
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  ActivityIndicator, 
  Chip, 
  Surface,
  Divider,
  IconButton,
  useTheme,
  Portal,
  Modal,
  List
} from 'react-native-paper';
import { COURSES } from '../data/courses';

export default function CourseSelectionScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Convert COURSES object to array and add id field
    const courseArray = Object.entries(COURSES).map(([id, course]) => ({ id, ...course }));
    setCourses(courseArray);
    setLoading(false);
  }, []);

  const handleCourseSelect = () => {
    if (!selectedCourseId) {
      Alert.alert('No Course Selected', 'Please select a golf course from the list.');
      return;
    }
    const selectedCourse = courses.find(course => course.id === selectedCourseId);
    if (!selectedCourse) {
      Alert.alert('Error', 'Selected course not found.');
      return;
    }
    navigation.navigate('PlayerSetup', { 
      courseKey: selectedCourse.id, 
      courseData: selectedCourse 
    });
  };

  const selectedCourse = courses.find(course => course.id === selectedCourseId);

  if (loading && courses.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
        <Text variant="titleMedium" style={styles.loadingText}>
          Loading golf courses...
        </Text>
        <Text variant="bodyMedium" style={[styles.loadingSubText, { color: theme.colors.onSurfaceVariant }]}>
          Preparing course data for testing
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Info */}
      <Surface style={styles.headerCard} elevation={2}>
        <View style={styles.headerContent}>
          <IconButton icon="golf" iconColor={theme.colors.primary} size={28} />
          <View style={styles.headerText}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
              Local Golf Courses
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              BC Metro Vancouver
            </Text>
          </View>
        </View>
      </Surface>

      {/* Course Selection */}
      <Card style={styles.courseCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Available Courses ({courses.length})
            </Text>
            <IconButton 
              icon="refresh" 
              size={24} 
              onPress={() => { /* No refresh needed, using static data */ }}
              iconColor={theme.colors.primary}
            />
          </View>
          
          {courses.length > 0 ? (
            <View>
              <Button
                mode="outlined"
                onPress={() => setShowCourseModal(true)}
                icon="golf"
                style={styles.selectButton}
              >
                {selectedCourse ? selectedCourse.name : 'Select a Golf Course'}
              </Button>
              
              {loading && (
                <View style={styles.inlineLoading}>
                  <ActivityIndicator animating={true} size="small" />
                  <Text variant="bodySmall" style={styles.loadingText}>Loading course details...</Text>
                </View>
              )}
            </View>
          ) : (
            <Text variant="bodyMedium" style={styles.noCoursesText}>
              No courses available. Please try refreshing.
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Selected Course Preview */}
      {selectedCourse && (
        <Card style={styles.previewCard}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Selected Course
            </Text>
            <Text variant="headlineSmall" style={styles.courseName}>
              {selectedCourse.name}
            </Text>
            <Text variant="bodyMedium" style={styles.courseLocation}>
              {selectedCourse.streetAddress}
            </Text>
            <Text variant="bodyMedium" style={styles.courseLocation}>
              {selectedCourse.City}, {selectedCourse.Province}, {selectedCourse.country}
            </Text>
            
            <Divider style={styles.divider} />
            
            <View style={styles.courseStats}>
              {selectedCourse.distance && (
                <Chip icon="map-marker" compact style={styles.statChip}>
                  {selectedCourse.distance.toFixed(1)} mi
                </Chip>
              )}
              {/* Show total Par */}
              {selectedCourse.pars && (
                <Chip icon="flag" compact style={styles.statChip}>
                  Par {selectedCourse.pars.reduce((sum, p) => sum + p, 0)}
                </Chip>
              )}
              {/* Show total yards */}
              {selectedCourse.yardages && (
                <Chip icon="ruler" compact style={styles.statChip}>
                  {selectedCourse.yardages.reduce((sum, y) => sum + y, 0).toLocaleString()} yds
                </Chip>
              )}
              {selectedCourse.preview && (
                <>
                  <Chip icon="flag" compact style={styles.statChip}>
                    Par {selectedCourse.preview.par}
                  </Chip>
                  <Chip icon="ruler" compact style={styles.statChip}>
                    {selectedCourse.preview.yardage.toLocaleString()} yds
                  </Chip>
                </>
              )}
            </View>
            
            {selectedCourse.phone && (
              <Text variant="bodySmall" style={styles.coursePhone}>
                📞 {selectedCourse.phone}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <Button
          mode="contained"
          onPress={handleCourseSelect}
          disabled={!selectedCourseId || loading}
          icon="golf-tee"
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          Continue to Player Setup
        </Button>
      </View>

      {/* Course Selection Modal */}
      <Portal>
        <Modal
          visible={showCourseModal}
          onDismiss={() => setShowCourseModal(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Select Golf Course</Text>
          <Divider style={styles.modalDivider} />
          <ScrollView style={styles.modalList}>
            {courses.map((course) => {
              const location = `${course.City}, ${course.Province}, ${course.country}`;
              return (
                <List.Item
                  key={course.id}
                  title={course.name}
                  description={`${course.streetAddress}\n${location}`}
                  left={props => <List.Icon {...props} icon="golf" />}
                  right={props => 
                    selectedCourseId === course.id ? 
                      <List.Icon {...props} icon="check" color={theme.colors.primary} /> : 
                      null
                  }
                  onPress={() => {
                    setSelectedCourseId(course.id);
                    setShowCourseModal(false);
                  }}
                  style={[
                    styles.listItem,
                    selectedCourseId === course.id && { backgroundColor: theme.colors.primaryContainer }
                  ]}
                />
              );
            })}
          </ScrollView>
          <Button onPress={() => setShowCourseModal(false)} style={styles.modalCloseButton}>
            Close
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingIndicator: {
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubText: {
    textAlign: 'center',
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  headerText: {
    flex: 1,
    marginLeft: 8,
  },
  courseCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectButton: {
    marginVertical: 8,
  },
  noCoursesText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  previewCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  courseName: {
    marginBottom: 4,
    fontWeight: '600',
  },
  courseLocation: {
    marginBottom: 12,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 12,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  coursePhone: {
    opacity: 0.8,
  },
  actionContainer: {
    marginBottom: 32,
  },
  actionButton: {
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  // Modal styles
  modalContainer: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  modalDivider: {
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 400,
  },
  listItem: {
    borderRadius: 8,
    marginBottom: 4,
  },
  modalCloseButton: {
    marginTop: 16,
  },
});
