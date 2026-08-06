import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image } from "react-native";
import { getIGDBToken } from "../../services/auth"; // caminho correto

export default function Console3DS() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

async function buscar() {
  try {
    const resp = await fetch(`http://localhost:3001/games?search=${query}&platform=37`);
    const data = await resp.json();
    setResults(data);
  } catch (error) {
    console.error("Erro na busca:", error);
  }
}


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pesquisar jogo do 3DS..."
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

      {item.first_release_date && (
        <Text>
          Lançamento: {new Date(item.first_release_date * 1000).getFullYear()}
        </Text>
      )}

      {item.involved_companies?.[0]?.company?.name && (
        <Text>Publisher: {item.involved_companies[0].company.name}</Text>
      )}

      {item.cover?.url && (
        <Image
          source={{ uri: item.cover.url.replace("t_thumb", "t_cover_big") }}
          style={{ width: 120, height: 160, marginTop: 8 }}
        />
      )}
    </View>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E3F2FD" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
  card: { padding: 15, backgroundColor: "#eee", marginVertical: 5, borderRadius: 8 },
  cardText: { fontSize: 16, fontWeight: "600" },
});
