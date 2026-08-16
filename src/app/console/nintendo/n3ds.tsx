import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * API URL resolution:
 * - For Netlify web build: set REACT_APP_API_URL in Netlify env vars (ex: https://seu-backend.onrailway.app)
 * - For native/dev: you can set global.API_URL before app start (e.g., in App entry) or use a config lib.
 */
// coloque exatamente onde estava const API
const API =
  (typeof process !== "undefined" && (process.env.REACT_APP_API_URL || process.env.EXPO_PUBLIC_API_URL)) ||
  (global && global.API_URL) ||
  "http://localhost:3001";
export const API_BASE = API.replace(/\/+$/, '');

console.log("API usada pelo frontend:", API);

export default function Console3DS() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoritosMap, setFavoritosMap] = useState<Record<string, any>>({});

  useEffect(() => {
    // carrega favoritos do AsyncStorage para marcar itens já salvos
    (async () => {
      try {
        const fav = await AsyncStorage.getItem("favoritos");
        const lista = fav ? JSON.parse(fav) : [];
        const map: Record<string, any> = {};
        lista.forEach((j: any) => {
          if (j && j.id) map[String(j.id)] = j;
        });
        setFavoritosMap(map);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
      }
    })();
  }, []);

  async function buscar() {
    if (!query || query.trim() === "") {
      Alert.alert("Atenção", "Digite um termo para buscar.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(
        `${API}/games?search=${encodeURIComponent(query)}&platform=37`
      );
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Erro na API: ${resp.status} ${text}`);
      }
      const data = await resp.json();
      // garante que cada item tenha id (ou gera um fallback)
      const normalized = Array.isArray(data)
        ? data.map((it, idx) => ({ id: it.id ?? `noid-${idx}`, ...it }))
        : [];
      // aplica marcação local de favoritos (status/tenho) se já existirem
      const merged = normalized.map((it) => {
        const f = favoritosMap[String(it.id)];
        return f ? { ...it, ...f } : it;
      });
      setResults(merged);
    } catch (error) {
      console.error("Erro na busca:", error);
      Alert.alert("Erro", "Não foi possível buscar jogos. Veja o console para detalhes.");
    } finally {
      setLoading(false);
    }
  }

  async function salvarComStatus(jogo: any, status: string) {
    try {
      const favoritos = await AsyncStorage.getItem("favoritos");
      let lista = favoritos ? JSON.parse(favoritos) : [];

      const index = lista.findIndex((j: any) => String(j.id) === String(jogo.id));

      if (index !== -1) {
        if (status === "Jogando" || status === "Fechado") {
          lista[index].status = status;
        } else if (status === "Tenho") {
          lista[index].tenho = true;
        }
      } else {
        const novo: any = { ...jogo, console: "3DS" };
        if (status === "Jogando" || status === "Fechado") {
          novo.status = status;
        } else if (status === "Tenho") {
          novo.tenho = true;
        }
        lista.push(novo);
      }

      await AsyncStorage.setItem("favoritos", JSON.stringify(lista));

      // atualiza mapa local e results para refletir mudança imediatamente
      const newMap = { ...favoritosMap, [String(jogo.id)]: lista.find((j: any) => String(j.id) === String(jogo.id)) || lista[lista.length - 1] };
      setFavoritosMap(newMap);
      setResults((prev) =>
        prev.map((it) => (String(it.id) === String(jogo.id) ? { ...it, ...newMap[String(jogo.id)] } : it))
      );

      Alert.alert("Sucesso", `${jogo.name} atualizado como "${status}"!`);
    } catch (error) {
      console.error("Erro ao salvar favorito:", error);
      Alert.alert("Erro", "Não foi possível salvar. Veja o console para detalhes.");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/logo3ds.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        placeholder="Pesquisar jogo do 3DS..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Buscar" onPress={buscar} />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            // cover safe access
            const coverUrl =
              item?.cover?.url && typeof item.cover.url === "string"
                ? item.cover.url.replace("t_thumb", "t_cover_big")
                : null;

            return (
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.name}</Text>

                {coverUrl ? (
                  <Image source={{ uri: coverUrl }} style={styles.cover} />
                ) : (
                  <View style={[styles.cover, { justifyContent: "center", alignItems: "center" }]}>
                    <Text style={{ fontSize: 12, color: "#666" }}>Sem capa</Text>
                  </View>
                )}

                <View style={styles.row}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: "#1976D2", opacity: item.status === "Jogando" ? 0.5 : 1 },
                    ]}
                    disabled={item.status === "Jogando"}
                    onPress={() => salvarComStatus(item, "Jogando")}
                  >
                    <Text style={styles.buttonText}>Jogando</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: "#388E3C", opacity: item.status === "Fechado" ? 0.5 : 1 },
                    ]}
                    disabled={item.status === "Fechado"}
                    onPress={() => salvarComStatus(item, "Fechado")}
                  >
                    <Text style={styles.buttonText}>Fechado</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: "#F57C00", opacity: item.tenho ? 0.5 : 1 },
                    ]}
                    disabled={item.tenho}
                    onPress={() => salvarComStatus(item, "Tenho")}
                  >
                    <Text style={styles.buttonText}>Tenho</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
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
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  cardText: { fontSize: 16, fontWeight: "600" },
  cover: { width: 120, height: 160, marginTop: 8, backgroundColor: "#ddd" },
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
