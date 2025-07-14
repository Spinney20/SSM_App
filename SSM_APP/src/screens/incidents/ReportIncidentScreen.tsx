import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, Image } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText, Divider, List, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../config/theme';
import { INCIDENT_TYPES } from '../../config/constants';
import { reportIncident } from '../../services/incidentService';

type IncidentType = 'near_miss' | 'minor_injury' | 'major_injury' | 'property_damage' | 'environmental' | 'other';

const ReportIncidentScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { authState } = useAuth();
  const { user } = authState;

  // State pentru formular
  const [type, setType] = useState<IncidentType>('near_miss');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState({
    description: '',
    location: '',
  });

  // Cerere permisiuni la încărcarea componentei
  useEffect(() => {
    (async () => {
      // Permisiuni pentru cameră
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert('Permisiune respinsă', 'Avem nevoie de acces la cameră pentru a putea raporta incidente cu fotografii.');
        }
      }

      // Permisiuni pentru locație
      let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Permisiune respinsă', 'Avem nevoie de acces la locație pentru a putea raporta incidente.');
      } else {
        getCurrentLocation();
      }
    })();
  }, []);

  // Obținere locație curentă
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Încercare de a obține adresa
      try {
        const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
        setLocation({
          latitude,
          longitude,
          address: `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`,
        });
      } catch (error) {
        // Dacă nu putem obține adresa, folosim doar coordonatele
        setLocation({ latitude, longitude });
      }
    } catch (error) {
      Alert.alert('Eroare', 'Nu s-a putut obține locația curentă.');
    } finally {
      setLocationLoading(false);
    }
  };

  // Selectare imagine din galerie
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        setPhotos([...photos, `data:image/jpeg;base64,${result.assets[0].base64}`]);
      }
    } catch (error) {
      Alert.alert('Eroare', 'Nu s-a putut selecta imaginea.');
    }
  };

  // Captură imagine cu camera
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        setPhotos([...photos, `data:image/jpeg;base64,${result.assets[0].base64}`]);
      }
    } catch (error) {
      Alert.alert('Eroare', 'Nu s-a putut captura imaginea.');
    }
  };

  // Eliminare fotografie
  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  // Validare formular
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      description: '',
      location: '',
    };

    if (!description.trim()) {
      newErrors.description = 'Descrierea este obligatorie';
      isValid = false;
    }

    if (!location) {
      newErrors.location = 'Locația este obligatorie';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Trimitere raport incident
  const handleSubmit = async () => {
    if (!validateForm() || !user) {
      return;
    }

    try {
      setLoading(true);
      
      const incidentData = {
        userId: user.id,
        projectId: 'default', // În versiunea MVP folosim un proiect default
        type,
        description,
        location: location!,
      };

      const incidentId = await reportIncident(incidentData, photos);
      
      Alert.alert(
        'Succes',
        'Incidentul a fost raportat cu succes!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Eroare', 'Nu s-a putut raporta incidentul. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Surface style={styles.formContainer}>
        <Text style={styles.title}>Raportează un incident</Text>

        {/* Selector tip incident */}
        <Text style={styles.sectionTitle}>Tip incident</Text>
        <RadioButton.Group onValueChange={value => setType(value as IncidentType)} value={type}>
          {Object.entries(INCIDENT_TYPES).map(([key, value]) => (
            <RadioButton.Item
              key={value}
              label={getIncidentTypeText(value)}
              value={value}
              style={styles.radioItem}
            />
          ))}
        </RadioButton.Group>

        <Divider style={styles.divider} />

        {/* Descriere incident */}
        <Text style={styles.sectionTitle}>Descriere incident</Text>
        <TextInput
          label="Descriere"
          value={description}
          onChangeText={text => {
            setDescription(text);
            setErrors(prev => ({ ...prev, description: '' }));
          }}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!errors.description}
        />
        {errors.description ? <HelperText type="error">{errors.description}</HelperText> : null}

        <Divider style={styles.divider} />

        {/* Locație */}
        <Text style={styles.sectionTitle}>Locație</Text>
        {locationLoading ? (
          <Text>Se obține locația...</Text>
        ) : location ? (
          <View>
            <Text>Latitudine: {location.latitude}</Text>
            <Text>Longitudine: {location.longitude}</Text>
            {location.address && <Text>Adresă: {location.address}</Text>}
          </View>
        ) : (
          <Text style={styles.errorText}>Locația nu a putut fi obținută</Text>
        )}
        <Button
          mode="outlined"
          onPress={getCurrentLocation}
          style={styles.locationButton}
          loading={locationLoading}
          disabled={locationLoading}
        >
          Actualizează locația
        </Button>
        {errors.location ? <HelperText type="error">{errors.location}</HelperText> : null}

        <Divider style={styles.divider} />

        {/* Fotografii */}
        <Text style={styles.sectionTitle}>Fotografii</Text>
        <View style={styles.photoButtonsContainer}>
          <Button
            mode="outlined"
            onPress={takePhoto}
            style={[styles.photoButton, styles.takePhotoButton]}
            icon="camera"
          >
            Fă o poză
          </Button>
          <Button
            mode="outlined"
            onPress={pickImage}
            style={styles.photoButton}
            icon="image"
          >
            Alege din galerie
          </Button>
        </View>

        {photos.length > 0 && (
          <View style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <Button
                  mode="text"
                  onPress={() => removePhoto(index)}
                  style={styles.removePhotoButton}
                  icon="close"
                  compact
                >
                  Elimină
                </Button>
              </View>
            ))}
          </View>
        )}

        <Divider style={styles.divider} />

        {/* Butoane */}
        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={[styles.button, styles.cancelButton]}
            disabled={loading}
          >
            Anulează
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Raportează
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 20,
  },
  radioItem: {
    paddingVertical: 4,
  },
  locationButton: {
    marginTop: 10,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  takePhotoButton: {
    marginLeft: 0,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  photoWrapper: {
    width: '48%',
    marginBottom: 10,
    marginRight: '2%',
  },
  photo: {
    width: '100%',
    height: 120,
    borderRadius: 5,
  },
  removePhotoButton: {
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    marginLeft: 0,
  },
  errorText: {
    color: theme.colors.error,
  },
});

export default ReportIncidentScreen; 