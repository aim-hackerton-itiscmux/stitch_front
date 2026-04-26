import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-container-padding">
        <Text className="text-section-header text-on-surface mb-2">{title}</Text>
        <Text className="text-body-main text-on-surface-variant text-center">
          Stitch 디자인 변환 대기 중
        </Text>
      </View>
    </SafeAreaView>
  );
}
