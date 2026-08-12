import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function Nintendo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/nintendo.png')} style={styles.logo} resizeMode="contain" />
      

      <View style={styles.buttons}>
        <View style={styles.btnWrapper}>
          <Button title="NES" onPress={() => router.push('/console/nintendo/nes')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="SNES" onPress={() => router.push('/console/nintendo/snes')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Game Boy" onPress={() => router.push('/console/nintendo/gb')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Nintendo 64" onPress={() => router.push('/console/nintendo/n64')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Virtual Boy" onPress={() => router.push('/console/nintendo/nvb')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Game Boy Advance" onPress={() => router.push('/console/nintendo/gba')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Game Cube" onPress={() => router.push('/console/nintendo/ngcube')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="NDS" onPress={() => router.push('/console/nintendo/nds')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Wii" onPress={() => router.push('/console/nintendo/wii')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Nintendo 3DS" onPress={() => router.push('/console/nintendo/n3ds')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Wii U" onPress={() => router.push('/console/nintendo/wiiu')} />
            <Image source={require('../assets/wiiulogou.png')} style={styles.icon} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Nintendo Switch" onPress={() => router.push('/console/nintendo/switch')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Nintendo Switch 2" onPress={() => router.push('/console/nintendo/ns2')} />
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
    backgroundColor: '#e01212',
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
