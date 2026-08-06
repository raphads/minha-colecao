import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Sega() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sega</Text>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#E65100' }]} onPress={() => router.push('/console/megadrive')}>
        <Text style={styles.cardText}>Mega Drive</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: '#FF9800' }]} onPress={() => router.push('/console/dreamcast')}>
        <Text style={styles.cardText}>Dreamcast</Text>
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
    backgroundColor: '#FFF3E0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#E65100',
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
});
