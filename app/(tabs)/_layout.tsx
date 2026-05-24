import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { colors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ember,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700"
        },
        tabBarItemStyle: {
          cursor: "default",
          outlineStyle: "none"
        } as never,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          height: 84,
          paddingTop: 8
        },
        tabBarButtonTestID: "bottom-tab"
      }}
    >
      <Tabs.Screen
        name="pathway"
        options={{
          title: "Pathway",
          tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="island/[id]"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="exercise/preview/[id]"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="exercise/[id]"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
