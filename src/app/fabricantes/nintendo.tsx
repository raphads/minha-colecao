import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Nintendo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nintendo</Text>
      <Button title="Nintendo 3DS" onPress={() => router.push('/console/n3ds')} />
      <Button title="Nintendo Switch" onPress={() => router.push('/console/switch')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: '#E6F4FE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#208AEF',
  },
});
