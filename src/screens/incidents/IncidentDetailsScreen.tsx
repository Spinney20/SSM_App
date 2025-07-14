import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Title, Paragraph, Card, Chip, Button, ActivityIndicator, Divider, List } from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { getIncidentById, updateIncidentStatus } from '../../services/incidentService';
import { Incident, InvolvedPerson } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type RouteParams = {
  params: {
    incidentId: string;
  };
};

const IncidentDetailsScreen = () => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const navigation = useNavigation();
  const { incidentId } = route.params;

  useEffect(() => {
    loadIncidentDetails();
  }, [incidentId]);

  const loadIncidentDetails = async () => {
    setLoading(true);
    try {
      const incidentData = await getIncidentById(incidentId);
      setIncident(incidentData);
    } catch (error) {
      console.error('Error loading incident details:', error);
      Alert.alert('Eroare', 'Nu am putut încărca detaliile incidentului.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!incident) return;
    
    setUpdating(true);
    try {
      await updateIncidentStatus(incidentId, newStatus);
      setIncident({ ...incident, status: newStatus });
      Alert.alert('Succes', 'Statusul incidentului a fost actualizat.');
    } catch (error) {
      console.error('Error updating incident status:', error);
      Alert.alert('Eroare', 'Nu am putut actualiza statusul incidentului.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#d32f2f" />
        <Title style={styles.errorTitle}>Incident negăsit</Title>
        <Paragraph style={styles.errorText}>
          Nu am putut găsi detaliile incidentului. Încercați să reîmprospătați pagina sau contactați administratorul.
        </Paragraph>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Înapoi
        </Button>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#FFCDD2';
      case 'investigating':
        return '#FFF9C4';
      case 'resolved':
        return '#C8E6C9';
      default:
        return '#E0E0E0';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Deschis';
      case 'investigating':
        return 'În investigare';
      case 'resolved':
        return 'Rezolvat';
      default:
        return status;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Ridicat';
      case 'medium':
        return 'Mediu';
      case 'low':
        return 'Scăzut';
      default:
        return severity;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{incident.title}</Title>
          
          <View style={styles.metaContainer}>
            <Chip 
              style={[styles.chip, { backgroundColor: getStatusColor(incident.status) }]}
            >
              {getStatusText(incident.status)}
            </Chip>
            
            <Chip 
              style={[
                styles.chip, 
                incident.severity === 'high' ? styles.highSeverity : 
                incident.severity === 'medium' ? styles.mediumSeverity : 
                styles.lowSeverity
              ]}
            >
              {getSeverityText(incident.severity)}
            </Chip>
          </View>
          
          <Paragraph style={styles.date}>
            Raportat pe {new Date(incident.date).toLocaleDateString('ro-RO')}
          </Paragraph>
          
          <Divider style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Descriere</Title>
          <Paragraph style={styles.description}>
            {incident.description}
          </Paragraph>
          
          {incident.location && (
            <>
              <Title style={styles.sectionTitle}>Locație</Title>
              <Paragraph style={styles.location}>
                {incident.location}
              </Paragraph>
            </>
          )}
          
          {incident.involvedPersons && incident.involvedPersons.length > 0 && (
            <>
              <Title style={styles.sectionTitle}>Persoane implicate</Title>
              <List.Section>
                {incident.involvedPersons.map((person: InvolvedPerson, index: number) => (
                  <List.Item
                    key={index}
                    title={person.name}
                    description={person.role || 'N/A'}
                    left={(props: any) => <List.Icon {...props} icon="account" />}
                  />
                ))}
              </List.Section>
            </>
          )}
          
          {incident.imageUrl && (
            <>
              <Title style={styles.sectionTitle}>Imagini</Title>
              <Image 
                source={{ uri: incident.imageUrl }} 
                style={styles.image} 
                resizeMode="cover"
              />
            </>
          )}
          
          <Divider style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Actualizare status</Title>
          <View style={styles.statusButtonsContainer}>
            <Button 
              mode={incident.status === 'open' ? 'contained' : 'outlined'}
              onPress={() => handleStatusUpdate('open')}
              style={styles.statusButton}
              loading={updating && incident.status !== 'open'}
              disabled={updating || incident.status === 'open'}
            >
              Deschis
            </Button>
            
            <Button 
              mode={incident.status === 'investigating' ? 'contained' : 'outlined'}
              onPress={() => handleStatusUpdate('investigating')}
              style={styles.statusButton}
              loading={updating && incident.status !== 'investigating'}
              disabled={updating || incident.status === 'investigating'}
            >
              În investigare
            </Button>
            
            <Button 
              mode={incident.status === 'resolved' ? 'contained' : 'outlined'}
              onPress={() => handleStatusUpdate('resolved')}
              style={styles.statusButton}
              loading={updating && incident.status !== 'resolved'}
              disabled={updating || incident.status === 'resolved'}
            >
              Rezolvat
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
  },
  highSeverity: {
    backgroundColor: '#FFCDD2',
  },
  mediumSeverity: {
    backgroundColor: '#FFF9C4',
  },
  lowSeverity: {
    backgroundColor: '#C8E6C9',
  },
  date: {
    marginTop: 8,
    color: '#757575',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    lineHeight: 22,
  },
  location: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusButton: {
    marginVertical: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#757575',
  },
});

export default IncidentDetailsScreen; 