import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { stitchColors } from "@/constants/theme";

export function AppHeader({ title = "청약 코파일럿" }: { title?: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-outline-variant bg-surface px-5 h-16">
      <Pressable
        onPress={() => router.push("/login")}
        accessibilityLabel="로그인"
        className="h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface-container">
        <MaterialIcons name="account-circle" size={24} color={stitchColors.primary} />
      </Pressable>
      <Text className="text-lg font-bold tracking-tighter text-on-surface">{title}</Text>
      <Pressable
        onPress={() => router.push("/notifications")}
        className="h-8 w-8 items-center justify-center rounded-full">
        <MaterialIcons name="notifications" size={22} color={stitchColors.primary} />
      </Pressable>
    </View>
  );
}
