import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, ActivityIndicator, FAB, Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../config/theme';
import { ROUTES } from '../../config/constants';
import { getRecentIncidents } from '../../services/incidentService';
import { Incident } from '../../types';

const IncidentsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { authState } = useAuth();
  const { user } = authState;

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Încărcare incidente
  useEffect(() => {
    loadIncidents();
  }, []);

  // Funcție pentru încărcarea incidentelor
  const loadIncidents = async () => {
    try {
      setLoading(true);
      const fetchedIncidents = await getRecentIncidents(50); // Obținem mai multe pentru a le putea filtra
      setIncidents(fetchedIncidents);
      setFilteredIncidents(fetchedIncidents);
      setError(null);
    } catch (err) {
      setError('Nu s-au putut încărca incidentele');
      console.error('Error loading incidents:', err);
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
      month: 'short',
      day: 'numeric',
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

  // Filtrare incidente după tip
  const filterByType = (type: string | null) => {
    setSelectedFilter(type);
    
    if (!type) {
      // Resetare la toate incidentele, dar aplicăm căutarea dacă există
      const filtered = searchQuery 
        ? incidents.filter(incident => 
            incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getIncidentTypeText(incident.type).toLowerCase().includes(searchQuery.toLowerCase())
          )
        : incidents;
      
      setFilteredIncidents(filtered);
      return;
    }
    
    // Filtrare după tip și căutare
    const filtered = incidents.filter(incident => {
      const matchesType = incident.type === type;
      
      if (!searchQuery) {
        return matchesType;
      }
      
      const matchesSearch = 
        incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getIncidentTypeText(incident.type).toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
    
    setFilteredIncidents(filtered);
  };

  // Căutare în incidente
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      // Dacă nu avem căutare, aplicăm doar filtrul de tip dacă există
      return filterByType(selectedFilter);
    }
    
    // Filtrare după căutare și tip
    const filtered = incidents.filter(incident => {
      const matchesSearch = 
        incident.description.toLowerCase().includes(query.toLowerCase()) ||
        getIncidentTypeText(incident.type).toLowerCase().includes(query.toLowerCase());
      
      if (!selectedFilter) {
        return matchesSearch;
      }
      
      const matchesType = incident.type === selectedFilter;
      return matchesSearch && matchesType;
    });
    
    setFilteredIncidents(filtered);
  };

  // Randare element incident
  const renderIncidentItem = ({ item }: { item: Incident }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.INCIDENT_DETAILS, { incidentId: item.id })}
    >
      <Card.Content>
        <Title>{getIncidentTypeText(item.type)}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
        
        <View style={styles.cardFooter}>
          <Text style={styles.date}>{formatDate(item.reportedAt)}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  // Randare filtre
  const renderFilters = () => {
    const filters = [
      { id: null, label: 'Toate' },
      { id: 'near_miss', label: 'Aproape accident' },
      { id: 'minor_injury', label: 'Accident minor' },
      { id: 'major_injury', label: 'Accident major' },
      { id: 'property_damage', label: 'Daune materiale' },
      { id: 'environmental', label: 'Incident de mediu' },
      { id: 'other', label: 'Altele' },
    ];

    return (
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id || 'all'}
          renderItem={({ item }) => (
            <Chip
              selected={selectedFilter === item.id}
              onPress={() => filterByType(item.id)}
              style={styles.filterChip}
              selectedColor={theme.colors.primary}
              mode={selectedFilter === item.id ? 'flat' : 'outlined'}
            >
              {item.label}
            </Chip>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Bara de căutare */}
      <Searchbar
        placeholder="Caută incidente..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Filtre */}
      {renderFilters()}

      {/* Lista de incidente */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredIncidents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nu există incidente</Text>
        </View>
      ) : (
        <FlatList
          data={filteredIncidents}
          keyExtractor={(item) => item.id}
          renderItem={renderIncidentItem}
          contentContainerStyle={styles.listContent}
        />
      )}

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
  searchBar: {
    margin: 10,
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    padding: 10,
    paddingBottom: 80, // Spațiu pentru FAB
  },
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  date: {
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: theme.colors.error,
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.placeholder,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default IncidentsScreen; 