import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, FAB, Searchbar, Chip, ActivityIndicator, List, Divider, IconButton, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers, deleteUserByAdmin } from '../../services/authService';
import { User } from '../../types';
import { ROUTES, USER_ROLES } from '../../config/constants';
import { theme } from '../../config/theme';

const AdminUsersScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { authState } = useAuth();
  const { user: currentUser } = authState;

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

  // Încărcare utilizatori
  useEffect(() => {
    loadUsers();
  }, []);

  // Efect pentru filtrare utilizatori
  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, selectedRole]);

  // Funcție pentru încărcarea utilizatorilor
  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Nu s-au putut încărca utilizatorii');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Funcție pentru filtrarea utilizatorilor
  const filterUsers = () => {
    let filtered = [...users];

    // Filtrare după căutare
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.employeeCode && user.employeeCode.toLowerCase().includes(query))
      );
    }

    // Filtrare după rol
    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  // Handler pentru căutare
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handler pentru filtrare după rol
  const handleRoleFilter = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  // Handler pentru ștergere utilizator
  const handleDeleteUser = async (userId: string, userName: string) => {
    // Nu permitem ștergerea propriului cont
    if (userId === currentUser?.id) {
      Alert.alert('Eroare', 'Nu puteți șterge propriul cont.');
      return;
    }

    Alert.alert(
      'Confirmare ștergere',
      `Sigur doriți să ștergeți utilizatorul ${userName}?`,
      [
        {
          text: 'Anulare',
          style: 'cancel',
        },
        {
          text: 'Ștergere',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteUserByAdmin(userId);
              // Actualizare listă utilizatori
              setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
              Alert.alert('Succes', 'Utilizatorul a fost șters cu succes.');
            } catch (err: any) {
              Alert.alert('Eroare', err.message || 'Nu s-a putut șterge utilizatorul.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Funcție pentru obținerea textului rolului
  const getRoleText = (role: string): string => {
    const roles: Record<string, string> = {
      [USER_ROLES.WORKER]: 'Muncitor',
      [USER_ROLES.TEAM_LEADER]: 'Șef echipă',
      [USER_ROLES.SSM_RESPONSIBLE]: 'Responsabil SSM',
      [USER_ROLES.ADMIN]: 'Administrator',
    };
    
    return roles[role] || 'Utilizator';
  };

  // Funcție pentru obținerea culorii rolului
  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      [USER_ROLES.WORKER]: theme.colors.primary,
      [USER_ROLES.TEAM_LEADER]: theme.colors.secondary,
      [USER_ROLES.SSM_RESPONSIBLE]: theme.colors.tertiary,
      [USER_ROLES.ADMIN]: theme.colors.error,
    };
    
    return colors[role] || theme.colors.primary;
  };

  // Funcție pentru afișarea meniului de acțiuni
  const toggleMenu = (userId: string) => {
    setMenuVisible(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Funcție pentru închiderea meniului
  const closeMenu = (userId: string) => {
    setMenuVisible(prev => ({
      ...prev,
      [userId]: false,
    }));
  };

  // Randare element utilizator
  const renderUserItem = ({ item }: { item: User }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View>
            <Title>{item.firstName} {item.lastName}</Title>
            <Paragraph>{item.email}</Paragraph>
            {item.employeeCode && (
              <Paragraph>Cod angajat: {item.employeeCode}</Paragraph>
            )}
          </View>
          <View style={styles.actionButtons}>
            <Menu
              visible={menuVisible[item.id] || false}
              onDismiss={() => closeMenu(item.id)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => toggleMenu(item.id)}
                />
              }
            >
              <Menu.Item
                title="Editare"
                leadingIcon="pencil"
                onPress={() => {
                  closeMenu(item.id);
                  navigation.navigate(ROUTES.EDIT_USER, { userId: item.id });
                }}
              />
              <Menu.Item
                title="Ștergere"
                leadingIcon="delete"
                onPress={() => {
                  closeMenu(item.id);
                  handleDeleteUser(item.id, `${item.firstName} ${item.lastName}`);
                }}
              />
            </Menu>
          </View>
        </View>
        <Chip
          style={[styles.roleChip, { backgroundColor: getRoleColor(item.role) }]}
          textStyle={styles.roleChipText}
        >
          {getRoleText(item.role)}
        </Chip>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Bară de căutare */}
      <Searchbar
        placeholder="Caută utilizatori..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Filtre pentru roluri */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrează după rol:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
          <Chip
            selected={selectedRole === USER_ROLES.WORKER}
            onPress={() => handleRoleFilter(USER_ROLES.WORKER)}
            style={styles.filterChip}
          >
            Muncitor
          </Chip>
          <Chip
            selected={selectedRole === USER_ROLES.TEAM_LEADER}
            onPress={() => handleRoleFilter(USER_ROLES.TEAM_LEADER)}
            style={styles.filterChip}
          >
            Șef echipă
          </Chip>
          <Chip
            selected={selectedRole === USER_ROLES.SSM_RESPONSIBLE}
            onPress={() => handleRoleFilter(USER_ROLES.SSM_RESPONSIBLE)}
            style={styles.filterChip}
          >
            Responsabil SSM
          </Chip>
          <Chip
            selected={selectedRole === USER_ROLES.ADMIN}
            onPress={() => handleRoleFilter(USER_ROLES.ADMIN)}
            style={styles.filterChip}
          >
            Administrator
          </Chip>
        </ScrollView>
      </View>

      {/* Indicator de încărcare */}
      {loading && (
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
      )}

      {/* Mesaj de eroare */}
      {error && !loading && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Title style={styles.errorTitle}>Eroare</Title>
            <Paragraph>{error}</Paragraph>
            <Button mode="contained" onPress={loadUsers} style={styles.retryButton}>
              Încearcă din nou
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Listă utilizatori */}
      {!loading && !error && (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Title style={styles.emptyTitle}>Nu s-au găsit utilizatori</Title>
                <Paragraph>Nu există utilizatori care să corespundă criteriilor de căutare.</Paragraph>
              </Card.Content>
            </Card>
          }
        />
      )}

      {/* Buton pentru adăugare utilizator nou */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="Utilizator nou"
        onPress={() => navigation.navigate(ROUTES.CREATE_USER)}
      />
    </View>
  );
};

// Stiluri
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  filtersScrollView: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    paddingBottom: 80, // Spațiu pentru FAB
  },
  userCard: {
    marginBottom: 12,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  roleChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  roleChipText: {
    color: 'white',
  },
  loader: {
    marginTop: 20,
  },
  errorCard: {
    marginTop: 20,
  },
  errorTitle: {
    color: theme.colors.error,
  },
  retryButton: {
    marginTop: 16,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default AdminUsersScreen; 