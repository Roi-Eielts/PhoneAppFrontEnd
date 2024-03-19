import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider } from "./src/module/AppContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirstPage from "./src/module/pages/FirstPage";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="FirstPage" component={FirstPage}></Stack.Screen>
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
export default App;