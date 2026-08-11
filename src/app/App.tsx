import React from "react";
import Console3DS from "../app/console/nintendo/n3ds";
import MinhaColecao from "../app/console/MinhaColecao";



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Console3DS" component={Console3DS} options={{ title: "Nintendo 3DS" }} />
        <Stack.Screen name="MinhaColecao" component={MinhaColecao} options={{ title: "Minha Coleção" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
