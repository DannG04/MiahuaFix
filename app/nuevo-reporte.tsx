import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/lib/supabase';

type LocationState =
  | { status: 'loading' }
  | { status: 'ok'; lat: number; lng: number }
  | { status: 'denied' };

export default function NuevoReporte() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationState>({ status: 'loading' });
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({ status: 'denied' });
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({ status: 'ok', lat: coords.latitude, lng: coords.longitude });
    })();
  }, []);

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita permiso de cámara para tomar la foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.7 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleEnviar() {
    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'Ingresa un título para el reporte.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Foto requerida', 'Toma una foto de la incidencia antes de enviar.');
      return;
    }
    if (location.status !== 'ok') {
      Alert.alert('Ubicación no disponible', 'Espera a que se obtenga tu ubicación.');
      return;
    }

    setEnviando(true);
    try {
      // 1. Subir foto a Storage
      const fileName = `reporte_${Date.now()}.jpg`;
      const response = await fetch(photoUri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('evidencias-reportes')
        .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: false });

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('evidencias-reportes')
        .getPublicUrl(fileName);

      // 3. Insertar en la tabla reportes
      const { error: insertError } = await supabase.from('reportes').insert({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        foto_url: publicUrl,
        ubicacion: `SRID=4326;POINT(${location.lng} ${location.lat})`,
      });

      if (insertError) throw insertError;

      Alert.alert('Reporte exitoso', 'Tu reporte fue enviado correctamente.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Ocurrió un error al enviar el reporte.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Ubicación */}
        {location.status === 'loading' && (
          <View style={styles.row}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.hint}>  Obteniendo ubicación...</Text>
          </View>
        )}
        {location.status === 'ok' && (
          <Text style={styles.coords}>
            📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </Text>
        )}
        {location.status === 'denied' && (
          <Text style={styles.error}>
            Permiso de ubicación denegado. Actívalo en la configuración del dispositivo.
          </Text>
        )}

        {/* Título */}
        <TextInput
          style={styles.input}
          placeholder="Título del reporte *"
          placeholderTextColor="#9CA3AF"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={120}
        />

        {/* Descripción */}
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Descripción opcional"
          placeholderTextColor="#9CA3AF"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        {/* Botón cámara + miniatura */}
        <TouchableOpacity style={styles.buttonSecondary} onPress={handleTakePhoto}>
          <Text style={styles.buttonSecondaryText}>
            {photoUri ? 'Volver a tomar foto' : 'Tomar Foto'}
          </Text>
        </TouchableOpacity>

        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
        )}

        {/* Enviar */}
        <TouchableOpacity
          style={[styles.buttonPrimary, enviando && styles.buttonDisabled]}
          onPress={handleEnviar}
          disabled={enviando}
        >
          {enviando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonPrimaryText}>Enviar Reporte</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#6B7280',
  },
  coords: {
    fontSize: 13,
    color: '#6B7280',
  },
  error: {
    fontSize: 14,
    color: '#DC2626',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonSecondary: {
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonPrimary: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
