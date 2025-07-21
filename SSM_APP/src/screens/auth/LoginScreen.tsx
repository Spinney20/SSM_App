import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, Divider } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/constants';
import { theme } from '../../config/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { Logo } from '../../components/common';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tipul pentru props
type LoginScreenProps = {
  navigation: StackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  // State pentru câmpuri formular
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);

  // Context autentificare
  const { login, loginWithMicrosoft } = useAuth();

  // Handler pentru autentificare
  const handleLogin = async () => {
    // Validare formular
    if (!email || !password) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Navigare se face automat prin AppNavigator
    } catch (error: any) {
      Alert.alert(
        'Eroare de autentificare',
        error.message || 'Nu s-a putut realiza autentificarea. Verifică datele și încearcă din nou.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler pentru autentificare cu Microsoft
  const handleMicrosoftLogin = async () => {
    try {
      setMicrosoftLoading(true);
      await loginWithMicrosoft();
      // Navigare se face automat prin AppNavigator
    } catch (error: any) {
      Alert.alert(
        'Eroare de autentificare',
        error.message || 'Nu s-a putut realiza autentificarea cu Microsoft. Încearcă din nou.'
      );
    } finally {
      setMicrosoftLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo și titlu */}
        <View style={styles.logoContainer}>
          <Logo size={120} />
          <Text style={styles.title}>SSM App</Text>
          <Text style={styles.subtitle}>Securitate și Sănătate în Muncă</Text>
        </View>

        {/* Formular autentificare */}
        <Surface style={styles.formContainer}>
          <Text style={styles.formTitle}>Autentificare</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Parolă"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            left={<TextInput.Icon icon="lock" />}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading || microsoftLoading}
          >
            Autentificare
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Ai uitat parola?</Text>
          </TouchableOpacity>

          <Divider style={styles.divider} />
          
          <Text style={styles.orText}>sau</Text>

          <Button
            mode="outlined"
            onPress={handleMicrosoftLogin}
            style={styles.microsoftButton}
            icon={() => <MaterialCommunityIcons name="microsoft" size={20} color="#0078D4" />}
            loading={microsoftLoading}
            disabled={loading || microsoftLoading}
          >
            Conectare cu Microsoft
          </Button>
        </Surface>

        {/* Link către înregistrare */}
        <View style={styles.registerContainer}>
          <Text>Nu ai cont? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text style={styles.registerText}>Înregistrează-te</Text>
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
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
  },
  divider: {
    marginVertical: 20,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 15,
    color: theme.colors.placeholder,
  },
  microsoftButton: {
    borderColor: '#0078D4',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 