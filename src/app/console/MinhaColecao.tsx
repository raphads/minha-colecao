import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // dropdown

export default function MinhaColecao() {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroConsole, setFiltroConsole] = useState("");
  const [filtroStatus, setFiltroStatus] = useState(""); // Jogando ou Fechado
  const [filtroTenho, setFiltroTenho] = useState(false);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    try {
      const data = await AsyncStorage.getItem("favoritos");
      if (data) {
        setFavoritos(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }

  async function atualizarStatus(id: number, novoStatus: string) {
    try {
      const novaLista = favoritos.map((jogo) => {
        if (jogo.id === id) {
          if (novoStatus === "Jogando" || novoStatus === "Fechado") {
            return { ...jogo, status: novoStatus };
          }
          if (novoStatus === "Tenho") {
            return { ...jogo, tenho: !jogo.tenho }; // toggle
          }
        }
        return jogo;
      });
      await AsyncStorage.setItem("favoritos", JSON.stringify(novaLista));
      setFavoritos(novaLista);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }

  async function removerFavorito(id: number) {
    try {
      const novaLista = favoritos.filter((jogo) => jogo.id !== id);
      await AsyncStorage.setItem("favoritos", JSON.stringify(novaLista));
      setFavoritos(novaLista);
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  }

  // Aplica filtros
  const filtrados = favoritos.filter((jogo) => {
    const nomeOk = jogo.name.toLowerCase().includes(filtroNome.toLowerCase());
    const consoleOk = filtroConsole
      ? jogo.console.toLowerCase().includes(filtroConsole.toLowerCase())
      : true;
    const statusOk = filtroStatus
      ? jogo.status === filtroStatus
      : true;
    const tenhoOk = filtroTenho ? jogo.tenho : true;
    return nomeOk && consoleOk && statusOk && tenhoOk;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Coleção</Text>

      {/* Filtros */}
      <TextInput
        placeholder="Filtrar por nome..."
        value={filtroNome}
        onChangeText={setFiltroNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Filtrar por console..."
        value={filtroConsole}
        onChangeText={setFiltroConsole}
        style={styles.input}
      />
      <Picker
        selectedValue={filtroStatus}
        onValueChange={(value) => setFiltroStatus(value)}
        style={styles.input}
      >
        <Picker.Item label="Todos" value="" />
        <Picker.Item label="Jogando" value="Jogando" />
        <Picker.Item label="Fechado" value="Fechado" />
      </Picker>
      <View style={styles.checkboxRow}>
        <Text>Mostrar apenas jogos que tenho</Text>
        <Switch value={filtroTenho} onValueChange={setFiltroTenho} />
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
            <Text>Console: {item.console}</Text>
            <Text>Status: {item.status || "N/A"}</Text>
            <Text>Tenho: {item.tenho ? "Sim" : "Não"}</Text>

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
                onPress={() => atualizarStatus(item.id, "Jogando")}
              >
                <Text style={styles.buttonText}>Jogando</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#388E3C", opacity: item.status === "Fechado" ? 0.5 : 1 }
                ]}
                disabled={item.status === "Fechado"}
                onPress={() => atualizarStatus(item.id, "Fechado")}
              >
                <Text style={styles.buttonText}>Fechado</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#F57C00", opacity: item.tenho ? 0.5 : 1 }
                ]}
                onPress={() => atualizarStatus(item.id, "Tenho")}
              >
                <Text style={styles.buttonText}>
                  {item.tenho ? "Tenho ✓" : "Tenho"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#C62828", marginTop: 10 }]}
              onPress={() => removerFavorito(item.id)}
            >
              <Text style={styles.buttonText}>Excluir da coleção</Text>
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
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
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
  buttonText: { color: "#fff", fontWeight: "bold" },
});
