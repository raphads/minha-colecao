import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function Sega() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/sega.png')} style={styles.logo} resizeMode="contain" />
      

      <View style={styles.buttons}>
        <View style={styles.btnWrapper}>
          <Button title="Mega Drive" onPress={() => router.push('/console/sega/megadrive')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Master System" onPress={() => router.push('/console/sega/mastersystes')} />
        </View>
         <View style={styles.btnWrapper}>
          <Button title="Game Gear" onPress={() => router.push('/console/sega/gamegear')} />
        </View>
         <View style={styles.btnWrapper}>
          <Button title="Sega Saturn" onPress={() => router.push('/console/sega/segasa')} />
        </View>
         <View style={styles.btnWrapper}>
          <Button title="Dreamcast" onPress={() => router.push('/console/sega/dreamcast')} />
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
    backgroundColor: '#1238e0',
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
