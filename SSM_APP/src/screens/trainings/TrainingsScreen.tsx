import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../config/theme';

const TrainingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="school" 
            size={60} 
            color={theme.colors.primary} 
            style={styles.icon}
          />
          <Title style={styles.title}>Instruiri</Title>
          <Paragraph style={styles.paragraph}>
            Această funcționalitate va fi disponibilă în curând.
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            Aici veți putea accesa materialele de instruire, completați teste și vedeți istoricul instruirilor.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Instruiri disponibile" />
        <Card.Content>
          <Paragraph>
            Nu există instruiri disponibile în acest moment.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Reîmprospătează</Button>
        </Card.Actions>
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
});

export default TrainingsScreen; 