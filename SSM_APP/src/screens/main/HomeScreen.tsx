import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, FAB, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../config/theme';
import { ROUTES } from '../../config/constants';
import { getRecentIncidents } from '../../services/incidentService';
import { Incident } from '../../types';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { authState } = useAuth();
  const { user } = authState;

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Încărcare incidente recente
  useEffect(() => {
    const loadRecentIncidents = async () => {
      try {
        setLoading(true);
        const recentIncidents = await getRecentIncidents(3);
        setIncidents(recentIncidents);
        setError(null);
      } catch (err) {
        setError('Nu s-au putut încărca incidentele recente');
        console.error('Error loading incidents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecentIncidents();
  }, []);

  // Formatare dată pentru afișare
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Dată necunoscută';
    
    const date = timestamp instanceof Date 
      ? timestamp 
      : new Date(typeof timestamp === 'number' ? timestamp : timestamp.seconds * 1000);
    
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obținere text pentru tipul incidentului
  const getIncidentTypeText = (type: string) => {
    const types: Record<string, string> = {
      near_miss: 'Aproape accident',
      minor_injury: 'Accident minor',
      major_injury: 'Accident major',
      property_damage: 'Daune materiale',
      environmental: 'Incident de mediu',
      other: 'Alt tip de incident',
    };
    return types[type] || 'Necunoscut';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Secțiune bun venit */}
        <Surface style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Bun venit, {user?.firstName || 'Utilizator'}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Securitatea și sănătatea în muncă sunt prioritatea noastră
          </Text>
        </Surface>

        {/* Secțiune acțiuni rapide */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acțiuni rapide</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate(ROUTES.REPORT_INCIDENT)}
            >
              <MaterialCommunityIcons name="alert-circle" size={32} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>Raportează incident</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate(ROUTES.RISK_ASSESSMENTS)}
            >
              <MaterialCommunityIcons name="shield-check" size={32} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>Evaluare risc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate(ROUTES.TRAININGS)}
            >
              <MaterialCommunityIcons name="school" size={32} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>Instruiri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate(ROUTES.ATTENDANCE)}
            >
              <MaterialCommunityIcons name="calendar-check" size={32} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>Prezență</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Secțiune incidente recente */}
        <View style={styles.recentIncidentsContainer}>
          <Text style={styles.sectionTitle}>Incidente recente</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : incidents.length === 0 ? (
            <Text style={styles.noDataText}>Nu există incidente recente</Text>
          ) : (
            incidents.map((incident) => (
              <Card
                key={incident.id}
                style={styles.incidentCard}
                onPress={() => navigation.navigate(ROUTES.INCIDENT_DETAILS, { incidentId: incident.id })}
              >
                <Card.Content>
                  <Title>{getIncidentTypeText(incident.type)}</Title>
                  <Paragraph numberOfLines={2}>{incident.description}</Paragraph>
                  <View style={styles.incidentMeta}>
                    <Text style={styles.incidentDate}>
                      {formatDate(incident.reportedAt)}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: 
                        incident.status === 'reported' ? theme.colors.warning :
                        incident.status === 'investigating' ? theme.colors.info :
                        incident.status === 'resolved' ? theme.colors.success :
                        theme.colors.placeholder
                      }
                    ]}>
                      <Text style={styles.statusText}>
                        {incident.status === 'reported' ? 'Raportat' :
                         incident.status === 'investigating' ? 'În investigare' :
                         incident.status === 'resolved' ? 'Rezolvat' :
                         incident.status === 'closed' ? 'Închis' : 'Necunoscut'}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}

          <Button
            mode="outlined"
            onPress={() => navigation.navigate(ROUTES.INCIDENTS)}
            style={styles.viewAllButton}
          >
            Vezi toate incidentele
          </Button>
        </View>
      </ScrollView>

      {/* Buton flotant pentru raportare rapidă */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="Raportează incident"
        onPress={() => navigation.navigate(ROUTES.REPORT_INCIDENT)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Spațiu pentru FAB
  },
  welcomeSection: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    backgroundColor: theme.colors.primary,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.colors.text,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  quickActionText: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.text,
  },
  recentIncidentsContainer: {
    marginBottom: 20,
  },
  incidentCard: {
    marginBottom: 12,
    elevation: 2,
  },
  incidentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  incidentDate: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewAllButton: {
    marginTop: 10,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginVertical: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    color: theme.colors.placeholder,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default HomeScreen; 