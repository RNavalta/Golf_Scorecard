import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Component to display detailed course information
export const CourseInfoCard = ({ course, style }) => {
  if (!course) return null;

  const totalPar = course.pars ? course.pars.reduce((sum, par) => sum + par, 0) : 72;
  const totalYardage = course.yardages ? course.yardages.reduce((sum, yardage) => sum + yardage, 0) : 6500;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.courseName}>{course.name}</Text>
      
      {course.address && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{course.address}</Text>
        </View>
      )}
      
      {course.city && course.state && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{course.city}, {course.state}</Text>
        </View>
      )}
      
      {course.phone && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{course.phone}</Text>
        </View>
      )}
      
      {course.rating && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Rating:</Text>
          <Text style={styles.value}>{course.rating}/5</Text>
        </View>
      )}
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Total Par:</Text>
        <Text style={styles.value}>{totalPar}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Total Yardage:</Text>
        <Text style={styles.value}>{totalYardage.toLocaleString()}</Text>
      </View>
      
      {course.greenFees && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Green Fees:</Text>
          <Text style={styles.value}>
            ${course.greenFees.weekday} weekday / ${course.greenFees.weekend} weekend
          </Text>
        </View>
      )}
      
      {course.facilities && course.facilities.length > 0 && (
        <View style={styles.facilitiesSection}>
          <Text style={styles.label}>Facilities:</Text>
          <Text style={styles.facilities}>{course.facilities.join(', ')}</Text>
        </View>
      )}
      
      {course.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 100,
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  facilitiesSection: {
    marginTop: 8,
  },
  facilities: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    fontStyle: 'italic',
  },
  descriptionSection: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    lineHeight: 20,
  },
});

export default CourseInfoCard;
