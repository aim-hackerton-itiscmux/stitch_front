import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";
import { apiFetch } from "@/lib/api";

type CheckItem = {
  item?: string;
  title?: string;
  importance?: string;
};

type Category = {
  name: string;
  items: CheckItem[];
};

export default function VisitChecklistScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const announcementId = id ?? "sh_301076";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/visit-checklist?announcement_id=${announcementId}`)
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setError("체크리스트를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [announcementId]);

  const totalItems = categories.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <View className="flex-row items-center gap-3 border-b border-outline-variant bg-surface-container-lowest px-container-padding py-4">
          <MaterialIcons name="checklist" size={22} color={stitchColors.primary} />
          <Text className="font-section-header text-section-header text-on-surface flex-1">
            임장 체크리스트
          </Text>
          {totalItems > 0 ? (
            <View className="rounded-full bg-primary/10 px-2 py-0.5">
              <Text className="font-caption-caps text-caption-caps text-primary">
                {totalItems}개 항목
              </Text>
            </View>
          ) : null}
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={stitchColors.primary} />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-container-padding">
            <MaterialIcons name="error-outline" size={48} color={stitchColors.error} />
            <Text className="mt-4 text-center text-body-main text-error">{error}</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
            showsVerticalScrollIndicator={false}>
            {categories.map((cat) => (
              <View key={cat.name} className="gap-stack-gap-md">
                <Text className="font-section-header text-section-header text-on-surface">
                  {cat.name}
                </Text>
                <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
                  {cat.items.map((item, i) => (
                    <View key={i}>
                      {i > 0 ? (
                        <View className="h-px bg-outline-variant/50 mx-container-padding" />
                      ) : null}
                      <View className="flex-row items-start gap-3 p-container-padding">
                        <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full border-2 border-primary/40">
                          <MaterialIcons
                            name="check"
                            size={12}
                            color={stitchColors["on-surface-variant"]}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-body-main text-body-main text-on-surface">
                            {item.item ?? item.title}
                          </Text>
                          {item.importance ? (
                            <Text className="mt-0.5 font-data-label text-data-label text-on-surface-variant">
                              {item.importance}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
