import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../config/theme';

const RiskAssessmentsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="shield-check" 
            size={60} 
            color={theme.colors.primary} 
            style={styles.icon}
          />
          <Title style={styles.title}>Evaluări de risc</Title>
          <Paragraph style={styles.paragraph}>
            Această funcționalitate va fi disponibilă în curând.
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            Aici veți putea completa și vizualiza evaluările de risc pentru diferite proiecte și activități.
          </Paragraph>
        </Card.Content>
      </Card>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Evaluare nouă"
        onPress={() => {}}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default RiskAssessmentsScreen; 