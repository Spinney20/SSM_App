import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, Button, Card, List, Divider, Dialog, Portal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../config/theme';
import { updateUserProfile } from '../../services/authService';
import { Logo } from '../../components/common';

const ProfileScreen: React.FC = () => {
  const { authState, logout, updateProfile } = useAuth();
  const { user } = authState;

  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'name' | 'phone'>('name');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

  // Obținere inițiale nume
  const getInitials = () => {
    if (!user) return '?';
    
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    
    return `${firstInitial}${lastInitial}`;
  };

  // Obținere text pentru rol
  const getRoleText = () => {
    if (!user) return '';
    
    const roles: Record<string, string> = {
      worker: 'Muncitor',
      team_leader: 'Șef echipă',
      ssm_responsible: 'Responsabil SSM',
      admin: 'Administrator',
    };
    
    return roles[user.role] || 'Utilizator';
  };

  // Deschidere dialog pentru editare
  const openDialog = (type: 'name' | 'phone') => {
    setDialogType(type);
    setShowDialog(true);
  };

  // Închidere dialog
  const closeDialog = () => {
    setShowDialog(false);
    
    // Resetare valori la valorile curente
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setPhoneNumber(user?.phoneNumber || '');
  };

  // Salvare modificări
  const saveChanges = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      if (dialogType === 'name') {
        await updateProfile({
          firstName,
          lastName,
        });
        
        Alert.alert('Succes', 'Numele a fost actualizat');
      } else if (dialogType === 'phone') {
        await updateProfile({
          phoneNumber,
        });
        
        Alert.alert('Succes', 'Numărul de telefon a fost actualizat');
      }
      
      setShowDialog(false);
    } catch (error) {
      Alert.alert('Eroare', 'Nu s-au putut salva modificările');
    } finally {
      setLoading(false);
    }
  };

  // Deconectare
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      Alert.alert('Eroare', 'Nu s-a putut realiza deconectarea');
    } finally {
      setLoading(false);
    }
  };

  // Confirmare deconectare
  const confirmLogout = () => {
    Alert.alert(
      'Deconectare',
      'Sigur doriți să vă deconectați?',
      [
        {
          text: 'Anulează',
          style: 'cancel',
        },
        {
          text: 'Deconectare',
          onPress: handleLogout,
          style: 'destructive',
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Nu sunteți autentificat</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profil utilizator */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={styles.avatar}
            color="white"
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.role}>{getRoleText()}</Text>
            {user.employeeCode && (
              <Text style={styles.employeeCode}>Cod angajat: {user.employeeCode}</Text>
            )}
          </View>
        </View>
      </Card>

      {/* Informații cont */}
      <Card style={styles.card}>
        <Card.Title title="Informații cont" />
        <Card.Content>
          <List.Item
            title="Email"
            description={user.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Nume și prenume"
            description={`${user.firstName} ${user.lastName}`}
            left={props => <List.Icon {...props} icon="account" />}
            right={props => <List.Icon {...props} icon="pencil" />}
            onPress={() => openDialog('name')}
          />
          <Divider />
          <List.Item
            title="Număr de telefon"
            description={user.phoneNumber || 'Nu este setat'}
            left={props => <List.Icon {...props} icon="phone" />}
            right={props => <List.Icon {...props} icon="pencil" />}
            onPress={() => openDialog('phone')}
          />
        </Card.Content>
      </Card>

      {/* Setări aplicație */}
      <Card style={styles.card}>
        <Card.Title title="Setări aplicație" />
        <Card.Content>
          <List.Item
            title="Notificări"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Limbă"
            description="Română"
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Despre aplicație"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      {/* Buton deconectare */}
      <Button
        mode="outlined"
        icon="logout"
        onPress={confirmLogout}
        style={styles.logoutButton}
        loading={loading}
        disabled={loading}
      >
        Deconectare
      </Button>

      {/* Logo și versiune */}
      <View style={styles.footer}>
        <Logo size={60} />
        <Text style={styles.version}>Versiune 1.0.0</Text>
      </View>

      {/* Dialog editare */}
      <Portal>
        <Dialog visible={showDialog} onDismiss={closeDialog}>
          <Dialog.Title>
            {dialogType === 'name' ? 'Editare nume' : 'Editare număr de telefon'}
          </Dialog.Title>
          <Dialog.Content>
            {dialogType === 'name' ? (
              <>
                <TextInput
                  label="Prenume"
                  value={firstName}
                  onChangeText={setFirstName}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Nume"
                  value={lastName}
                  onChangeText={setLastName}
                  mode="outlined"
                  style={styles.input}
                />
              </>
            ) : (
              <TextInput
                label="Număr de telefon"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Anulează</Button>
            <Button
              onPress={saveChanges}
              loading={loading}
              disabled={loading}
            >
              Salvează
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  profileCard: {
    margin: 10,
    padding: 10,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  employeeCode: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  logoutButton: {
    margin: 10,
    marginTop: 20,
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  version: {
    marginTop: 10,
    color: theme.colors.placeholder,
  },
  input: {
    marginBottom: 15,
  },
});

export default ProfileScreen; 