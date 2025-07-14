import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../config/constants';
import { resetPassword } from '../../services/authService';
import { Logo } from '../../components/common';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Eroare', 'Vă rugăm să introduceți adresa de email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Succes',
        'Un email pentru resetarea parolei a fost trimis la adresa dvs. de email.',
        [{ text: 'OK', onPress: () => navigation.navigate(ROUTES.LOGIN as never) }]
      );
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut trimite emailul de resetare. Verificați adresa de email și încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo size={120} style={styles.logo} />
      <Title style={styles.title}>Resetare parolă</Title>
      <Text style={styles.subtitle}>
        Introduceți adresa de email și vă vom trimite un link pentru resetarea parolei.
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Trimite email de resetare
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate(ROUTES.LOGIN as never)}
        style={styles.linkButton}
      >
        Înapoi la autentificare
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#757575',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  linkButton: {
    marginTop: 20,
  },
});

export default ForgotPasswordScreen; 