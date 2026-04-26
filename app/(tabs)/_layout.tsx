import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

import { stitchColors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: stitchColors.primary,
        tabBarInactiveTintColor: stitchColors["on-surface-variant"],
        tabBarStyle: {
          backgroundColor: stitchColors["surface-container-lowest"],
          borderTopColor: stitchColors["outline-variant"],
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: "공고",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="list-alt" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "분석",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="analytics" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="prep"
        options={{
          title: "준비",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="menu-book" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="my-subscriptions"
        options={{
          title: "내 청약",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
