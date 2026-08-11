import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function Nintendo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/nintendo.png')} style={styles.logo} resizeMode="contain" />
      

      <View style={styles.buttons}>
        <View style={styles.btnWrapper}>
          <Button title="PS1" onPress={() => router.push('/console/nintendo/n3ds')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="PS2" onPress={() => router.push('/console/nintendo/switch')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1264e0',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ce0617',
    marginBottom: 24,
  },
  buttons: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
    
  },
  btnWrapper: {
    width: '100%',
    maxWidth: 360,
    color: '#ce0617',
  },
});
