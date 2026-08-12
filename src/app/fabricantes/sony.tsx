import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const consoles = [
  { key: 'nes', title: 'PlayStation', route: '/console/nintendo/nes', image: require('../../assets/consoles/nes.png') },
  { key: 'snes', title: 'PlayStation 2', route: '/console/nintendo/snes', image: require('../../assets/consoles/snes.png') },
  { key: 'gb', title: 'PlayStation 3', route: '/console/nintendo/gb', image: require('../../assets/consoles/gb.png') },
  { key: 'n64', title: 'PlayStation 4', route: '/console/nintendo/n64', image: require('../../assets/consoles/ninty64.png') },
  { key: 'nvb', title: 'PlayStation 5', route: '/console/nintendo/nvb', image: require('../../assets/consoles/nvb.png') },
  { key: 'gba', title: 'PSP', route: '/console/nintendo/gba', image: require('../../assets/consoles/gba.png') },
  { key: 'ngcube', title: 'PS Vita', route: '/console/nintendo/ngcube', image: require('../../assets/consoles/gc.png') },
  { key: 'nds', title: 'NDS', route: '/console/nintendo/nds', image: require('../../assets/consoles/nds.png') },
  { key: 'wii', title: 'Wii', route: '/console/nintendo/wii', image: require('../../assets/consoles/wii.png') },
  { key: 'n3ds', title: 'Nintendo 3DS', route: '/console/nintendo/n3ds', image: require('../../assets/consoles/n3ds.png') },
  { key: 'wiiu', title: 'Wii U', route: '/console/nintendo/wiiu', image: require('../../assets/consoles/wiiu.png') },
  { key: 'switch', title: 'Nintendo Switch', route: '/console/nintendo/switch', image: require('../../assets/consoles/ns.png') },
  { key: 'ns2', title: 'Nintendo Switch 2', route: '/console/nintendo/ns2', image: require('../../assets/consoles/s2.png') },
];

export default function Sony() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const itemMargin = 25;
  const itemSize = Math.floor((screenWidth - 500 - itemMargin * (numColumns - 1)) / numColumns); 
  // 40 = paddingHorizontal total (20 + 20)

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/pslogo.png')} style={styles.logo} resizeMode="contain" />

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
    backgroundColor: '#6d86abaa',
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
    backgroundColor: '#6e809baa',
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
