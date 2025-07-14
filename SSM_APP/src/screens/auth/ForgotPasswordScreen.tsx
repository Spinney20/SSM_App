import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/constants';
import { theme } from '../../config/theme';
import { StackNavigationProp } from '@react-navigation/stack';

// Tipul pentru props
type ForgotPasswordScreenProps = {
  navigation: StackNavigationProp<any>;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  // State pentru email
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Context autentificare
  const { resetPassword } = useAuth();

  // Validare email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handler pentru resetare parolă
  const handleResetPassword = async () => {
    // Validare email
    if (!email.trim()) {
      setEmailError('Email-ul este obligatoriu');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Email-ul nu este valid');
      return;
    }

    setEmailError('');

    try {
      setLoading(true);
      await resetPassword(email);
      setEmailSent(true);
      Alert.alert(
        'Email trimis',
        'Un email pentru resetarea parolei a fost trimis la adresa ta de email.'
      );
    } catch (error: any) {
      Alert.alert(
        'Eroare',
        error.message || 'Nu s-a putut trimite email-ul pentru resetarea parolei. Încearcă din nou.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resetare parolă</Text>
      <Text style={styles.subtitle}>
        Introdu adresa de email asociată contului tău și îți vom trimite un link pentru resetarea parolei
      </Text>

      <Surface style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!emailError}
          left={<TextInput.Icon icon="email" />}
          disabled={emailSent || loading}
        />
        {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}
          loading={loading}
          disabled={loading || emailSent}
        >
          {emailSent ? 'Email trimis' : 'Trimite link de resetare'}
        </Button>

        {emailSent && (
          <Button
            mode="outlined"
            onPress={() => setEmailSent(false)}
            style={[styles.button, styles.resendButton]}
          >
            Trimite din nou
          </Button>
        )}
      </Surface>

      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
          <Text style={styles.loginText}>Înapoi la autentificare</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  resendButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen; 