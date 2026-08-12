import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
     <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity style={[styles.card, { backgroundColor: '#ccd1e2' }]} onPress={() => router.push('/console/MinhaColecao')}>
        <Text style={styles.cardText}>Minha Coleção</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#ef2020' }]} onPress={() => router.push('/fabricantes/nintendo')}>
        <Text style={styles.cardText}>Nintendo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#2274de' }]} onPress={() => router.push('/fabricantes/sega')}>
        <Text style={styles.cardText}>Sega</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#03165f' }]} onPress={() => router.push('/fabricantes/sony')}>
        <Text style={styles.cardText}>Sony</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#035f06' }]} onPress={() => router.push('/fabricantes/xboxms')}>
        <Text style={styles.cardText}>Xbox</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  card: {
    width: '80%',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
});
