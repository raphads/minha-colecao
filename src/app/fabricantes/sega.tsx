import { useRouter } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const consoles = [
  { key: 'ms', title: 'Master System', route: '/console/sega/mastersystes', image: require('../../assets/consoles/ms.png') },
  { key: 'md', title: 'Mega Drive', route: '/console/sega/megadrive', image: require('../../assets/consoles/md.png') },
  { key: 'gg', title: 'Game Gear', route: '/console/sega/gamegear', image: require('../../assets/consoles/gg.png') },
  { key: 'segacd', title: 'Sega CD', route: '/console/sega/segacd', image: require('../../assets/consoles/segacd.png') },
  { key: 's32x', title: 'Sega 32x', route: '/console/sega/s32x', image: require('../../assets/consoles/s32x.png') },
  { key: 'ss', title: 'Sega Saturn', route: '/console/sega/segasa', image: require('../../assets/consoles/ss.png') },
  { key: 'dc', title: 'Dreamcast', route: '/console/sega/dreamcas', image: require('../../assets/consoles/dc.png') },
];

export default function Sega() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const itemMargin = 25;
  const itemSize = Math.floor((screenWidth - 500 - itemMargin * (numColumns - 1)) / numColumns); 
  // 40 = paddingHorizontal total (20 + 20)

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/sega.png')} style={styles.logo} resizeMode="contain" />

      <FlatList
        data={consoles}
        keyExtractor={(item) => item.key}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: itemSize, height: itemSize }]}
            onPress={() => router.push(item.route)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={item.title}
          >
            <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
            <Text style={styles.cardText} numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    backgroundColor: '#1238e0',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 4,
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 2,
    width: '100%',
    maxWidth: 10000,
  },
  card: {
    backgroundColor: '#1802a7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    // sombra
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: '80%',
    height: '80%',
    marginBottom: 2,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#d3cccc',
    textAlign: 'center',
  },
});
