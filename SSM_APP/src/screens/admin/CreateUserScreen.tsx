import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, HelperText, Surface, Divider, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createUserByAdmin } from '../../services/authService';
import { USER_ROLES } from '../../config/constants';
import { theme } from '../../config/theme';

const CreateUserScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  // State pentru câmpuri formular
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [role, setRole] = useState(USER_ROLES.WORKER);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validări
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validare email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validare formular
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email-ul nu este valid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Parola este obligatorie';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Parola trebuie să aibă minim 6 caractere';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu coincid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handler pentru creare utilizator
  const handleCreateUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await createUserByAdmin(email, password, firstName, lastName, role as any, employeeCode);
      
      Alert.alert(
        'Succes',
        'Utilizatorul a fost creat cu succes',
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
        error.message || 'Nu s-a putut crea utilizatorul. Încearcă din nou.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Creare utilizator nou</Text>
        <Text style={styles.subtitle}>Completează datele pentru a crea un cont nou</Text>

        <Surface style={styles.formContainer}>
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
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            left={<TextInput.Icon icon="email" />}
          />
          {errors.email ? <HelperText type="error">{errors.email}</HelperText> : null}

          <TextInput
            label="Cod angajat (opțional)"
            value={employeeCode}
            onChangeText={setEmployeeCode}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="badge-account" />}
          />

          <TextInput
            label="Parolă"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            error={!!errors.password}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.password ? <HelperText type="error">{errors.password}</HelperText> : null}

          <TextInput
            label="Confirmare parolă"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            error={!!errors.confirmPassword}
            left={<TextInput.Icon icon="lock-check" />}
          />
          {errors.confirmPassword ? (
            <HelperText type="error">{errors.confirmPassword}</HelperText>
          ) : null}

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
              disabled={loading}
            >
              Anulare
            </Button>
            
            <Button
              mode="contained"
              onPress={handleCreateUser}
              style={[styles.button, styles.createButton]}
              loading={loading}
              disabled={loading}
            >
              Creare utilizator
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
  createButton: {
    marginLeft: 8,
  },
});

export default CreateUserScreen; 