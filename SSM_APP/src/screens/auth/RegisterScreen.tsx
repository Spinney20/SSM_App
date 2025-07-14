import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/constants';
import { theme } from '../../config/theme';
import { StackNavigationProp } from '@react-navigation/stack';

// Tipul pentru props
type RegisterScreenProps = {
  navigation: StackNavigationProp<any>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  // State pentru câmpuri formular
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
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

  // Context autentificare
  const { register } = useAuth();

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

  // Handler pentru înregistrare
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await register(email, password, firstName, lastName, 'worker', employeeCode);
      // Navigare se face automat prin AppNavigator
    } catch (error: any) {
      Alert.alert(
        'Eroare la înregistrare',
        error.message || 'Nu s-a putut realiza înregistrarea. Încearcă din nou.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Creează cont</Text>
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
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            left={<TextInput.Icon icon="lock" />}
          />
          {errors.password ? <HelperText type="error">{errors.password}</HelperText> : null}

          <TextInput
            label="Confirmă parola"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            error={!!errors.confirmPassword}
            left={<TextInput.Icon icon="lock-check" />}
          />
          {errors.confirmPassword ? <HelperText type="error">{errors.confirmPassword}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Înregistrare
          </Button>
        </Surface>

        <View style={styles.loginContainer}>
          <Text>Ai deja cont? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.loginText}>Autentifică-te</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 