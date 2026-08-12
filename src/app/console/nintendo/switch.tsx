import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ConsoleSwitch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function buscar() {
    try {
      const resp = await fetch(
        // aqui você troca o platform para o ID do Switch na IGDB
        `http://localhost:3001/games?search=${query}&platform=130`
      );
      const data = await resp.json();
      setResults(data);
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  }

  async function salvarComStatus(jogo: any, status: string) {
    try {
      const favoritos = await AsyncStorage.getItem("favoritos");
      let lista = favoritos ? JSON.parse(favoritos) : [];

      const index = lista.findIndex((j: any) => j.id === jogo.id);

      if (index !== -1) {
        if (status === "Jogando" || status === "Fechado") {
          lista[index].status = status;
        } else if (status === "Tenho") {
          lista[index].tenho = true;
        }
      } else {
        const novo = { ...jogo, console: "Switch" };
        if (status === "Jogando" || status === "Fechado") {
          novo.status = status;
        } else if (status === "Tenho") {
          novo.tenho = true;
        }
        lista.push(novo);
      }

      await AsyncStorage.setItem("favoritos", JSON.stringify(lista));
      alert(`${jogo.name} atualizado como "${status}"!`);
    } catch (error) {
      console.error("Erro ao salvar favorito:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/switchlogo.png')} style={styles.logo} resizeMode="contain" />
      <TextInput
        placeholder="Pesquisar jogo do Switch..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Buscar" onPress={buscar} />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>

            {item.cover?.url && (
              <Image
                source={{ uri: item.cover.url.replace("t_thumb", "t_cover_big") }}
                style={styles.cover}
              />
            )}

            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#1976D2", opacity: item.status === "Jogando" ? 0.5 : 1 }
                ]}
                disabled={item.status === "Jogando"}
                onPress={() => salvarComStatus(item, "Jogando")}
              >
                <Text style={styles.buttonText}>Jogando</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#388E3C", opacity: item.status === "Fechado" ? 0.5 : 1 }
                ]}
                disabled={item.status === "Fechado"}
                onPress={() => salvarComStatus(item, "Fechado")}
              >
                <Text style={styles.buttonText}>Fechado</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#F57C00", opacity: item.tenho ? 0.5 : 1 }
                ]}
                disabled={item.tenho}
                onPress={() => salvarComStatus(item, "Tenho")}
              >
                <Text style={styles.buttonText}>Tenho</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E3F2FD" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  card: {
    padding: 15,
    backgroundColor: "#eee",
    marginVertical: 5,
    borderRadius: 8,
  },
  cardText: { fontSize: 16, fontWeight: "600" },
  cover: { width: 120, height: 160, marginTop: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
