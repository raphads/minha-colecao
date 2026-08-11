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

import Emoji from "react-native-emoji";




const CONSOLES = ["3DS", "Switch", "PS4", "PS5","PS3","PS2","PS1","Switch 2", "SNES","NES","NDS","N64","Game Cube","Game & Watch","Game Boy","Game Boy Advance","Game Gear","Sega Saturn","Dreamcas","32x","Master System","Mega Drive",];

const REGIONS = [
  { key: "usa", emoji: "🇺🇸" },
  { key: "japan", emoji: "🇯🇵" },
  { key: "eu", emoji: "🇪🇺" },
  { key: "uno", emoji: "🇺🇳" },
];

// mapeamento para imagens locais (crie assets/flags/ e adicione os PNGs)
const REGION_IMAGES: Record<string, any> = {
  usa: require("../../assets/flags/usa.png"),
  japan: require("../../assets/flags/japan.webp"),
  eu: require("../../assets/flags/europe.webp"),
  uno: require("../../assets/flags/uno.webp"),
};


export default function MinhaColecao() {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTenho, setFiltroTenho] = useState(false);
  const [consoleQuery, setConsoleQuery] = useState("");
  const [consolesSelecionados, setConsolesSelecionados] = useState<string[]>([]);

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
      let novaLista = favoritos.map((jogo) => {
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

      // regra: se não tem status e não tem "tenho", remove da lista
      novaLista = novaLista.filter((jogo) => jogo.status || jogo.tenho);

      await AsyncStorage.setItem("favoritos", JSON.stringify(novaLista));
      setFavoritos(novaLista);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }

  // toggleRegion usa estado local e persiste em AsyncStorage
  async function toggleRegion(id: number, regionKey: string) {
    try {
      const novaLista = favoritos.map((jogo) => {
        if (jogo.id === id) {
          const regions: string[] = Array.isArray(jogo.regions) ? [...jogo.regions] : [];
          if (regions.includes(regionKey)) {
            return { ...jogo, regions: regions.filter((r) => r !== regionKey) };
          } else {
            return { ...jogo, regions: [...regions, regionKey] };
          }
        }
        return jogo;
      });

      // mantém a regra: se não tem status e não tem "tenho", remove da lista
      const filtrada = novaLista.filter((jogo) => jogo.status || jogo.tenho);

      await AsyncStorage.setItem("favoritos", JSON.stringify(filtrada));
      setFavoritos(filtrada);
    } catch (error) {
      console.error("Erro ao alternar região:", error);
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

  function toggleConsole(consoleName: string) {
    if (consolesSelecionados.includes(consoleName)) {
      setConsolesSelecionados(consolesSelecionados.filter((c) => c !== consoleName));
    } else {
      setConsolesSelecionados([...consolesSelecionados, consoleName]);
    }
    setConsoleQuery("");
  }

  // Aplica filtros
  const filtrados = favoritos.filter((jogo) => {
    const nomeOk = jogo.name.toLowerCase().includes(filtroNome.toLowerCase());
    const consoleOk =
      consolesSelecionados.length > 0
        ? consolesSelecionados.includes(jogo.console)
        : true;
    const statusOk = filtroStatus ? jogo.status === filtroStatus : true;
    const tenhoOk = filtroTenho ? jogo.tenho : true;
    return nomeOk && consoleOk && statusOk && tenhoOk;
  });

  const sugestoes = CONSOLES.filter((c) =>
    c.toLowerCase().startsWith(consoleQuery.toLowerCase())
  );

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

      {/* Consoles com autocomplete */}

<View style={styles.autocompleteWrapper}>
  <TextInput
    placeholder="Digite console..."
    value={consoleQuery}
    onChangeText={setConsoleQuery}
    style={styles.input}
  />

  {consoleQuery.length > 0 && (
    <FlatList
      style={styles.suggestionList}            // controla altura/posição
      contentContainerStyle={styles.suggestionListContent}
      data={sugestoes}
      keyExtractor={(item) => item}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.suggestion}
          onPress={() => toggleConsole(item)}
        >
          <Text style={styles.suggestionText}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  )}
</View>

      {/* Tags selecionadas */}
      <View style={styles.tagRow}>
        {consolesSelecionados.map((c) => (
          <TouchableOpacity
            key={c}
            style={styles.tag}
            onPress={() => toggleConsole(c)}
          >
            <Text style={styles.tagText}>{c} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Status */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filtroStatus === "" ? "#1976D2" : "#ccc" },
          ]}
          onPress={() => setFiltroStatus("")}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filtroStatus === "Jogando" ? "#1976D2" : "#ccc" },
          ]}
          onPress={() => setFiltroStatus("Jogando")}
        >
          <Text style={styles.filterText}>Jogando</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filtroStatus === "Fechado" ? "#1976D2" : "#ccc" },
          ]}
          onPress={() => setFiltroStatus("Fechado")}
        >
          <Text style={styles.filterText}>Fechado</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxRow}>
        <Text>Mostrar apenas jogos que tenho</Text>
        <Switch value={filtroTenho} onValueChange={setFiltroTenho} />
      </View>

      {/* Lista */}
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

            {/* region toggles (bandeiras) */}
           {/* region toggles (bandeiras) */}
<View style={styles.regionRow}>
  {REGIONS.map((r) => {
    const active = Array.isArray(item.regions) && item.regions.includes(r.key);
    return (
      <TouchableOpacity
        key={r.key}
        style={[
          styles.regionButton,
          active ? styles.regionButtonActive : styles.regionButtonInactive,
        ]}
        onPress={() => toggleRegion(item.id, r.key)}
      >
        <Image
          source={REGION_IMAGES[r.key]}
          style={[
            styles.regionImage,
            active ? styles.regionImageActive : null,
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  })}
</View>


            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#1976D2", opacity: item.status === "Jogando" ? 0.5 : 1 },
                ]}
                disabled={item.status === "Jogando"}
                onPress={() => atualizarStatus(item.id, "Jogando")}
              >
                <Text style={styles.buttonText}>Jogando</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#388E3C", opacity: item.status === "Fechado" ? 0.5 : 1 },
                ]}
                disabled={item.status === "Fechado"}
                onPress={() => atualizarStatus(item.id, "Fechado")}
              >
                <Text style={styles.buttonText}>Fechado</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "#F57C00", opacity: item.tenho ? 0.5 : 1 },
                ]}
                onPress={() => atualizarStatus(item.id, "Tenho")}
              >
                <Text style={styles.buttonText}>
                  {item.tenho ? "Tenho ✓" : "Tenho"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F3E5F5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  suggestionList: {
    maxHeight: 220,   // aumenta a área visível da lista de sugestões
    marginBottom: 12,
  },
  suggestion: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    marginVertical: 8,
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: "600",
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  tag: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  filterButton: {
    flex: 1,
    marginHorizontal: 6,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  filterText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  card: {
    padding: 20,
    backgroundColor: "#eee",
    marginVertical: 12,
    borderRadius: 10,
  },
  cardText: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  cover: { width: 150, height: 200, marginTop: 12, borderRadius: 6 },

  /* region toggles styles */
  regionRow: { flexDirection: "row", marginTop: 8 },
  regionButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
      overflow: "hidden",      // garante que a imagem não "vaze" do botão
  padding: 6,              // espaço interno para a imagem respirar
  },
  regionButtonActive: {
    backgroundColor: "#4d0dad",
  },
  regionButtonInactive: {
    backgroundColor: "#eee",
  },
  /* imagem ocupa percentual do botão (mantém proporção) */
regionImage: {
  width: "100%",           // ocupa toda a largura disponível dentro do padding
  height: "100%",          // ocupa toda a altura disponível dentro do padding
  maxWidth: 32,            // limita para evitar ficar muito grande em telas grandes
  maxHeight: 24,
},
regionImageActive: {
  transform: [{ scale: 1.05 }],
},

  button: {
    flex: 1,
    marginHorizontal: 6,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});
