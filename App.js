import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider } from "./src/module/AppContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirstPage from "./src/module/pages/FirstPage";
import LoginPage from "./src/module/pages/Login"
import OverviewPage from "./src/module/pages/Overview";
import CreateProduct from "./src/module/pages/CreatePage";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}
        initialRouteName="Login">
          <Stack.Screen name="Login" component={ LoginPage }></Stack.Screen>
          <Stack.Screen name="Overview" component={ OverviewPage}></Stack.Screen>
          <Stack.Screen name="Create" component={ CreateProduct }></Stack.Screen>
          {/* <Stack.Screen name="FirstPage" component={FirstPage}></Stack.Screen> */}
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}
export default App;