import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MinhaColecao() {
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    try {
      const data = await AsyncStorage.getItem("favoritos3ds");
      if (data) {
        setFavoritos(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }

  async function removerFavorito(id: number) {
    try {
      const novaLista = favoritos.filter((jogo) => jogo.id !== id);
      await AsyncStorage.setItem("favoritos3ds", JSON.stringify(novaLista));
      setFavoritos(novaLista);
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Coleção 3DS</Text>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>

            {item.cover?.url && (
              <Image
                source={{
                  uri: item.cover.url.replace("t_thumb", "t_cover_big"),
                }}
                style={styles.cover}
              />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => removerFavorito(item.id)}
            >
              <Text style={styles.buttonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F3E5F5" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: "#eee",
    marginVertical: 5,
    borderRadius: 8,
  },
  cardText: { fontSize: 16, fontWeight: "600" },
  cover: { width: 120, height: 160, marginTop: 8 },
  button: {
    marginTop: 10,
    backgroundColor: "#C62828",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
