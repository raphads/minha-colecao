import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function Nintendo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/xboxlogo.png')} style={styles.logo} resizeMode="contain" />
      

      <View style={styles.buttons}>
        <View style={styles.btnWrapper}>
          <Button title="Xbox" onPress={() => router.push('/console/xbox/xbox')} />
        </View>
        <View style={styles.btnWrapper}>
          <Button title="Xbox 360" onPress={() => router.push('/console/xbox/x360')} />
        </View>
         <View style={styles.btnWrapper}>
          <Button title="Xbox One" onPress={() => router.push('/console/xbox/xone')} />
        </View>
         <View style={styles.btnWrapper}>
          <Button title="Xbox Series" onPress={() => router.push('/console/xbox/xs')} />
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
    backgroundColor: '#14c400aa',
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
