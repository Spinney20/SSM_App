import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, List, Divider, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../config/theme';

// Notificări de test
const dummyNotifications = [
  {
    id: '1',
    title: 'Instruire expirată',
    message: 'Instruirea periodică SSM a expirat. Vă rugăm să completați instruirea cât mai curând.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ieri
    read: false,
    type: 'training_expired',
  },
  {
    id: '2',
    title: 'Incident nou raportat',
    message: 'Un nou incident a fost raportat în proiectul "Construcție pod".',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Acum 3 zile
    read: true,
    type: 'incident_reported',
  },
  {
    id: '3',
    title: 'Sarcină nouă',
    message: 'Ați fost desemnat responsabil pentru evaluarea riscurilor în proiectul "Renovare clădire".',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Acum o săptămână
    read: true,
    type: 'task_assigned',
  },
];

const NotificationsScreen: React.FC = () => {
  // Formatare dată pentru afișare
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Astăzi';
    } else if (diffDays === 1) {
      return 'Ieri';
    } else if (diffDays < 7) {
      return `Acum ${diffDays} zile`;
    } else {
      return date.toLocaleDateString('ro-RO');
    }
  };

  // Obținere icon pentru tipul notificării
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'training_expired':
        return 'school';
      case 'incident_reported':
        return 'alert-circle';
      case 'task_assigned':
        return 'clipboard-check';
      default:
        return 'bell';
    }
  };

  // Randare element notificare
  const renderNotificationItem = ({ item }: { item: typeof dummyNotifications[0] }) => (
    <View>
      <List.Item
        title={item.title}
        description={item.message}
        left={props => (
          <List.Icon
            {...props}
            icon={getNotificationIcon(item.type)}
            color={item.read ? theme.colors.placeholder : theme.colors.primary}
          />
        )}
        right={props => (
          <Text style={[styles.date, item.read ? styles.readDate : styles.unreadDate]}>
            {formatDate(item.date)}
          </Text>
        )}
        style={[styles.listItem, !item.read && styles.unreadItem]}
      />
      <Divider />
    </View>
  );

  return (
    <View style={styles.container}>
      {dummyNotifications.length > 0 ? (
        <>
          <FlatList
            data={dummyNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
          <Button
            mode="text"
            style={styles.markAllButton}
          >
            Marchează toate ca citite
          </Button>
        </>
      ) : (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyCardContent}>
            <MaterialCommunityIcons 
              name="bell-off" 
              size={60} 
              color={theme.colors.placeholder} 
              style={styles.icon}
            />
            <Title style={styles.emptyTitle}>Nu aveți notificări</Title>
            <Paragraph style={styles.emptyParagraph}>
              Notificările vor apărea aici atunci când vor fi disponibile.
            </Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    flexGrow: 1,
  },
  listItem: {
    paddingVertical: 12,
  },
  unreadItem: {
    backgroundColor: 'rgba(30, 136, 229, 0.05)',
  },
  date: {
    fontSize: 12,
    alignSelf: 'center',
    marginRight: 10,
  },
  readDate: {
    color: theme.colors.placeholder,
  },
  unreadDate: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  markAllButton: {
    margin: 10,
  },
  emptyCard: {
    margin: 16,
    elevation: 2,
  },
  emptyCardContent: {
    alignItems: 'center',
    padding: 30,
  },
  icon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyParagraph: {
    textAlign: 'center',
  },
});

export default NotificationsScreen; 