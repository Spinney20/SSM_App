import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../config/constants';
import { getIncidents } from '../../services/incidentService';
import { Incident } from '../../types';

const IncidentsScreen = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const incidentsData = await getIncidents();
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filterValue: string) => {
    setFilter(filter === filterValue ? null : filterValue);
  };

  const filteredIncidents = incidents
    .filter((incident: Incident) => {
      const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           incident.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = !filter || incident.severity === filter;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a: Incident, b: Incident) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderIncidentCard = ({ item }: { item: Incident }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(ROUTES.INCIDENT_DETAILS as never, { incidentId: item.id } as never)}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.title}</Title>
          <View style={styles.metaContainer}>
            <Chip 
              style={[
                styles.severityChip, 
                item.severity === 'high' ? styles.highSeverity : 
                item.severity === 'medium' ? styles.mediumSeverity : 
                styles.lowSeverity
              ]}
            >
              {item.severity === 'high' ? 'Ridicat' : 
               item.severity === 'medium' ? 'Mediu' : 'Scăzut'}
            </Chip>
            <Paragraph style={styles.date}>
              {new Date(item.date).toLocaleDateString('ro-RO')}
            </Paragraph>
          </View>
          <Paragraph numberOfLines={2} style={styles.description}>
            {item.description}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Caută incidente"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filterContainer}>
        <Chip 
          selected={filter === 'high'} 
          onPress={() => handleFilter('high')} 
          style={[styles.filterChip, filter === 'high' && styles.highSeverity]}
        >
          Ridicat
        </Chip>
        <Chip 
          selected={filter === 'medium'} 
          onPress={() => handleFilter('medium')} 
          style={[styles.filterChip, filter === 'medium' && styles.mediumSeverity]}
        >
          Mediu
        </Chip>
        <Chip 
          selected={filter === 'low'} 
          onPress={() => handleFilter('low')} 
          style={[styles.filterChip, filter === 'low' && styles.lowSeverity]}
        >
          Scăzut
        </Chip>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
        </View>
      ) : (
        <FlatList
          data={filteredIncidents}
          renderItem={renderIncidentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Paragraph style={styles.emptyText}>
                Nu există incidente care să corespundă criteriilor de căutare.
              </Paragraph>
            </View>
          }
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate(ROUTES.REPORT_INCIDENT as never)}
        label="Raportează"
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 8,
  },
  card: {
    marginHorizontal: 8,
    marginVertical: 6,
    elevation: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  severityChip: {
    height: 30,
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
    color: '#757575',
  },
  description: {
    marginTop: 8,
    color: '#424242',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0056b3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
  },
});

export default IncidentsScreen; 