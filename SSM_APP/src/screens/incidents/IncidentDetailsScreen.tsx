import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Alert, Linking } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, Divider, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getIncidentById, updateIncidentStatus } from '../../services/incidentService';
import { theme } from '../../config/theme';
import { Incident } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

type RouteParams = {
  IncidentDetails: {
    incidentId: string;
  };
};

const IncidentDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'IncidentDetails'>>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { authState } = useAuth();
  const { user } = authState;
  const { incidentId } = route.params;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Încărcare incident
  useEffect(() => {
    loadIncidentDetails();
  }, [incidentId]);

  // Funcție pentru încărcarea detaliilor incidentului
  const loadIncidentDetails = async () => {
    try {
      setLoading(true);
      const incidentData = await getIncidentById(incidentId);
      
      if (!incidentData) {
        setError('Incidentul nu a fost găsit');
        return;
      }
      
      setIncident(incidentData);
    } catch (err) {
      setError('Nu s-au putut încărca detaliile incidentului');
      console.error('Error loading incident details:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Obținere text pentru statusul incidentului
  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      reported: 'Raportat',
      investigating: 'În investigare',
      resolved: 'Rezolvat',
      closed: 'Închis',
    };
    return statuses[status] || 'Necunoscut';
  };

  // Obținere culoare pentru statusul incidentului
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return theme.colors.warning;
      case 'investigating':
        return theme.colors.info;
      case 'resolved':
        return theme.colors.success;
      case 'closed':
        return theme.colors.placeholder;
      default:
        return theme.colors.placeholder;
    }
  };

  // Actualizare status incident
  const handleStatusUpdate = async (newStatus: 'reported' | 'investigating' | 'resolved' | 'closed') => {
    if (!incident) return;

    try {
      setStatusLoading(true);
      await updateIncidentStatus(incidentId, newStatus);
      
      // Actualizare locală
      setIncident(prev => prev ? { ...prev, status: newStatus } : null);
      
      Alert.alert('Succes', 'Statusul incidentului a fost actualizat');
    } catch (err) {
      Alert.alert('Eroare', 'Nu s-a putut actualiza statusul incidentului');
    } finally {
      setStatusLoading(false);
    }
  };

  // Deschidere locație pe hartă
  const openLocation = () => {
    if (!incident?.location) return;

    const { latitude, longitude } = incident.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Eroare', 'Nu se poate deschide aplicația de hărți');
        }
      })
      .catch(() => {
        Alert.alert('Eroare', 'Nu se poate deschide aplicația de hărți');
      });
  };

  // Verificare dacă utilizatorul poate actualiza statusul
  const canUpdateStatus = () => {
    if (!user || !incident) return false;
    
    // În MVP, permitem oricui să actualizeze statusul
    // În versiunea finală, vom verifica rolul utilizatorului
    return true;
  };

  // Randare butoane pentru actualizare status
  const renderStatusButtons = () => {
    if (!incident || !canUpdateStatus()) return null;

    const nextStatus = {
      reported: 'investigating',
      investigating: 'resolved',
      resolved: 'closed',
      closed: null,
    } as const;

    const nextStatusText = {
      reported: 'Marchează ca în investigare',
      investigating: 'Marchează ca rezolvat',
      resolved: 'Marchează ca închis',
      closed: null,
    } as const;

    const currentStatus = incident.status as keyof typeof nextStatus;
    const next = nextStatus[currentStatus];

    if (!next) return null;

    return (
      <Button
        mode="contained"
        onPress={() => handleStatusUpdate(next)}
        loading={statusLoading}
        disabled={statusLoading}
        style={styles.statusButton}
      >
        {nextStatusText[currentStatus]}
      </Button>
    );
  };

  // Randare galerie foto
  const renderPhotoGallery = () => {
    if (!incident?.photos || incident.photos.length === 0) {
      return (
        <View style={styles.noPhotosContainer}>
          <MaterialCommunityIcons name="image-off" size={48} color={theme.colors.placeholder} />
          <Text style={styles.noPhotosText}>Nu există fotografii</Text>
        </View>
      );
    }

    const { width } = Dimensions.get('window');
    const photoWidth = width - 40; // Padding de 20 pe ambele părți

    return (
      <View>
        <Image
          source={{ uri: incident.photos[currentPhotoIndex] }}
          style={[styles.mainPhoto, { width: photoWidth, height: photoWidth * 0.75 }]}
          resizeMode="cover"
        />
        
        {incident.photos.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsContainer}>
            {incident.photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentPhotoIndex(index)}
                style={[
                  styles.thumbnailWrapper,
                  currentPhotoIndex === index && styles.activeThumbnail
                ]}
              >
                <Image source={{ uri: photo }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !incident) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error || 'A apărut o eroare'}</Text>
        <Button mode="contained" onPress={loadIncidentDetails} style={styles.retryButton}>
          Încearcă din nou
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Titlu și status */}
          <View style={styles.headerContainer}>
            <Title style={styles.title}>{getIncidentTypeText(incident.type)}</Title>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(incident.status) }]}
              textStyle={styles.statusChipText}
            >
              {getStatusText(incident.status)}
            </Chip>
          </View>

          {/* Data raportării */}
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.placeholder} />
            <Text style={styles.dateText}>Raportat la {formatDate(incident.reportedAt)}</Text>
          </View>

          <Divider style={styles.divider} />

          {/* Descriere */}
          <Text style={styles.sectionTitle}>Descriere</Text>
          <Paragraph style={styles.description}>{incident.description}</Paragraph>

          <Divider style={styles.divider} />

          {/* Locație */}
          <Text style={styles.sectionTitle}>Locație</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationInfo}>
              <Text>Latitudine: {incident.location.latitude}</Text>
              <Text>Longitudine: {incident.location.longitude}</Text>
              {incident.location.address && <Text>Adresă: {incident.location.address}</Text>}
            </View>
            <Button
              mode="outlined"
              icon="map-marker"
              onPress={openLocation}
              style={styles.mapButton}
            >
              Vezi pe hartă
            </Button>
          </View>

          <Divider style={styles.divider} />

          {/* Fotografii */}
          <Text style={styles.sectionTitle}>Fotografii</Text>
          {renderPhotoGallery()}

          {/* Acțiuni luate și măsuri preventive - vizibile doar dacă există */}
          {incident.actionsTaken && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Acțiuni luate</Text>
              <Paragraph style={styles.description}>{incident.actionsTaken}</Paragraph>
            </>
          )}

          {incident.preventiveMeasures && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Măsuri preventive</Text>
              <Paragraph style={styles.description}>{incident.preventiveMeasures}</Paragraph>
            </>
          )}

          {/* Butoane pentru actualizare status */}
          {renderStatusButtons()}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.error,
  },
  retryButton: {
    marginTop: 10,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 5,
    color: theme.colors.placeholder,
    fontSize: 14,
  },
  divider: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  mapButton: {
    marginLeft: 10,
  },
  mainPhoto: {
    borderRadius: 8,
    marginBottom: 10,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnailWrapper: {
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: theme.colors.primary,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  noPhotosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  noPhotosText: {
    marginTop: 10,
    color: theme.colors.placeholder,
  },
  statusButton: {
    marginTop: 20,
  },
});

export default IncidentDetailsScreen; 