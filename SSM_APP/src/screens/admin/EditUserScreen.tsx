import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, HelperText, Surface, Divider, RadioButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAllUsers, updateUserByAdmin } from '../../services/authService';
import { USER_ROLES } from '../../config/constants';
import { User } from '../../types';
import { theme } from '../../config/theme';

// Tipul pentru parametrii rutei
type EditUserRouteParams = {
  EditUser: {
    userId: string;
  };
};

const EditUserScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<RouteProp<EditUserRouteParams, 'EditUser'>>();
  const { userId } = route.params;

  // State pentru utilizator
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validări
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
  });

  // Încărcare date utilizator
  useEffect(() => {
    loadUserData();
  }, [userId]);

  // Funcție pentru încărcarea datelor utilizatorului
  const loadUserData = async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      const foundUser = users.find(u => u.id === userId);
      
      if (!foundUser) {
        setError('Utilizatorul nu a fost găsit');
        return;
      }
      
      setUser(foundUser);
      setFirstName(foundUser.firstName);
      setLastName(foundUser.lastName);
      setEmployeeCode(foundUser.employeeCode || '');
      setRole(foundUser.role);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Nu s-au putut încărca datele utilizatorului');
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Validare formular
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
    };

    if (!firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handler pentru actualizare utilizator
  const handleUpdateUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      await updateUserByAdmin(userId, {
        firstName,
        lastName,
        role: role as any,
        employeeCode: employeeCode || undefined,
      });
      
      Alert.alert(
        'Succes',
        'Utilizatorul a fost actualizat cu succes',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Eroare',
        error.message || 'Nu s-a putut actualiza utilizatorul. Încearcă din nou.'
      );
    } finally {
      setUpdating(false);
    }
  };

  // Randare conținut în funcție de starea încărcării
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Se încarcă datele utilizatorului...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Utilizatorul nu a fost găsit'}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.errorButton}>
          Înapoi
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Editare utilizator</Text>
        <Text style={styles.subtitle}>Actualizează datele utilizatorului</Text>

        <Surface style={styles.formContainer}>
          <TextInput
            label="Email"
            value={user.email}
            mode="outlined"
            style={styles.input}
            disabled
            left={<TextInput.Icon icon="email" />}
          />
          <HelperText type="info">Email-ul nu poate fi modificat</HelperText>

          <TextInput
            label="Prenume"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
            error={!!errors.firstName}
            left={<TextInput.Icon icon="account" />}
          />
          {errors.firstName ? <HelperText type="error">{errors.firstName}</HelperText> : null}

          <TextInput
            label="Nume"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
            error={!!errors.lastName}
            left={<TextInput.Icon icon="account" />}
          />
          {errors.lastName ? <HelperText type="error">{errors.lastName}</HelperText> : null}

          <TextInput
            label="Cod angajat (opțional)"
            value={employeeCode}
            onChangeText={setEmployeeCode}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="badge-account" />}
          />

          <Divider style={styles.divider} />
          
          <Text style={styles.roleTitle}>Rol utilizator</Text>
          
          <RadioButton.Group onValueChange={value => setRole(value)} value={role}>
            <View style={styles.radioItem}>
              <RadioButton value={USER_ROLES.WORKER} />
              <Text style={styles.radioLabel}>Muncitor</Text>
            </View>
            
            <View style={styles.radioItem}>
              <RadioButton value={USER_ROLES.TEAM_LEADER} />
              <Text style={styles.radioLabel}>Șef echipă</Text>
            </View>
            
            <View style={styles.radioItem}>
              <RadioButton value={USER_ROLES.SSM_RESPONSIBLE} />
              <Text style={styles.radioLabel}>Responsabil SSM</Text>
            </View>
            
            <View style={styles.radioItem}>
              <RadioButton value={USER_ROLES.ADMIN} />
              <Text style={styles.radioLabel}>Administrator</Text>
            </View>
          </RadioButton.Group>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={[styles.button, styles.cancelButton]}
              disabled={updating}
            >
              Anulare
            </Button>
            
            <Button
              mode="contained"
              onPress={handleUpdateUser}
              style={[styles.button, styles.saveButton]}
              loading={updating}
              disabled={updating}
            >
              Salvare
            </Button>
          </View>
        </Surface>
      </View>
    </ScrollView>
  );
};

// Stiluri
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  formContainer: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 8,
  },
  saveButton: {
    marginLeft: 8,
  },
});

export default EditUserScreen; 