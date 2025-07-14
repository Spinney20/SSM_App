import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../config/theme';

const AttendanceScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="calendar-check" 
            size={60} 
            color={theme.colors.primary} 
            style={styles.icon}
          />
          <Title style={styles.title}>Prezență</Title>
          <Paragraph style={styles.paragraph}>
            Această funcționalitate va fi disponibilă în curând.
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            Aici veți putea înregistra prezența zilnică și vizualiza istoricul prezenței.
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="login"
          style={[styles.button, styles.checkInButton]}
          labelStyle={styles.buttonLabel}
        >
          Check-in
        </Button>

        <Button
          mode="outlined"
          icon="logout"
          style={[styles.button, styles.checkOutButton]}
          labelStyle={styles.buttonLabel}
        >
          Check-out
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Activitate recentă" />
        <Card.Content>
          <Paragraph>
            Nu există activitate recentă.
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  checkInButton: {
    backgroundColor: theme.colors.success,
  },
  checkOutButton: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
});

export default AttendanceScreen; 