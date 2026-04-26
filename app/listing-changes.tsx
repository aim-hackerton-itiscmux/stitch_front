import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";
import { apiFetch } from "@/lib/api";

type Change = {
  change_type?: string;
  description?: string;
  changed_at?: string;
  old_value?: string;
  new_value?: string;
};

export default function ListingChangesScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const announcementId = id ?? "sh_301076";

  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch(`/announcement-changes?announcement_id=${announcementId}`)
      .then((data) => {
        // flat 배열 우선, 없으면 changes fallback
        setChanges(data.flat ?? data.changes ?? []);
      })
      .catch(() => setError("변경 내역을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [announcementId]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <View className="flex-row items-center gap-3 border-b border-outline-variant bg-surface-container-lowest px-container-padding py-4">
          <MaterialIcons name="history" size={22} color={stitchColors.primary} />
          <Text className="font-section-header text-section-header text-on-surface">
            공고 변경 내역
          </Text>
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
        ) : changes.length === 0 ? (
          <View className="flex-1 items-center justify-center px-container-padding">
            <MaterialIcons
              name="check-circle-outline"
              size={48}
              color={stitchColors["on-surface-variant"]}
            />
            <Text className="mt-4 text-center text-body-main text-on-surface-variant">
              변경 내역이 없습니다.
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-stack-gap-md"
            showsVerticalScrollIndicator={false}>
            {changes.map((c, i) => (
              <View
                key={i}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-container-padding gap-stack-gap-sm">
                {c.changed_at ? (
                  <Text className="font-data-label text-data-label text-on-surface-variant">
                    {new Date(c.changed_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                ) : null}
                <Text className="font-body-main text-body-main text-on-surface">
                  {c.description ?? c.change_type}
                </Text>
                {c.old_value && c.new_value ? (
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-outline text-sm line-through">{c.old_value}</Text>
                    <MaterialIcons name="arrow-forward" size={14} color={stitchColors.primary} />
                    <Text className="text-primary text-sm font-semibold">{c.new_value}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
