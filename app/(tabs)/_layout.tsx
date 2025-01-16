import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const TABS = [
  { name: "bin", title: "Lixeira", icon: "trash-bin" },
  { name: "tasks", title: "Tarefas", icon: "checkbox" },
  { name: "index", title: "Notas", icon: "document" },
  { name: "account", title: "Conta", icon: "person" },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {TABS.map((tab) => {
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarStyle: {
                backgroundColor: "white",
              },
              tabBarLabelStyle: {
                fontSize: 13,
                paddingVertical: 6,
                paddingHorizontal: 16,
              },
              tabBarActiveBackgroundColor: "#363636",
              tabBarActiveTintColor: "#fff",
              tabBarInactiveTintColor: "#000",
              tabBarIconStyle: { display: "none" },
            }}
          />
        );
      })}
    </Tabs>
  );
}
