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
  { key: 'ps1', title: 'PlayStation', route: '/console/ps/ps1', image: require('../../assets/consoles/ps1.png') },
  { key: 'ps2', title: 'PlayStation 2', route: '/console/ps/ps2', image: require('../../assets/consoles/ps2.png') },
  { key: 'ps3', title: 'PlayStation 3', route: '/console/ps/ps3', image: require('../../assets/consoles/ps3.png') },
  { key: 'ps4', title: 'PlayStation 4', route: '/console/ps/ps4', image: require('../../assets/consoles/ps4.png') },
  { key: 'ps5', title: 'PlayStation 5', route: '/console/ps/ps5', image: require('../../assets/consoles/ps5.png') },
  { key: 'psp', title: 'PSP', route: '/console/ps/psp', image: require('../../assets/consoles/psp.png') },
  { key: 'psv', title: 'PS Vita', route: '/console/ps/psv', image: require('../../assets/consoles/psv.png') },
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
