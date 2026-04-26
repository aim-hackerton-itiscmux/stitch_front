import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";
import { api, Announcement } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "미정";
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function daysUntil(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [listing, setListing] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!id || !session) return;
    api.announcements
      .get(id)
      .then(setListing)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, session]);

  async function toggleFavorite() {
    if (!id) return;
    try {
      await api.favorites.add(id);
      setFavorited(true);
    } catch (e) {
      console.error(e);
    }
  }

  const dLabel = daysUntil(listing?.apply_end ?? null);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <AppHeader />

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={stitchColors.primary} />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
            showsVerticalScrollIndicator={false}>

            <View className="gap-stack-gap-lg">
              <View className="gap-stack-gap-sm">
                <View className="flex-row items-center gap-2 flex-wrap">
                  {dLabel ? (
                    <View className="rounded-full bg-tertiary-container px-2 py-1">
                      <Text className="font-caption-caps text-caption-caps text-on-tertiary-container">
                        {dLabel} 청약예정
                      </Text>
                    </View>
                  ) : null}
                  {listing?.housing_type ? (
                    <View className="rounded-full bg-surface-container-highest px-2 py-1">
                      <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                        {listing.housing_type}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text className="font-report-headline text-report-headline text-on-background">
                  {listing?.title ?? "공고 상세"}
                </Text>
              </View>

              <View className="rounded-xl border border-outline-variant bg-surface-container-lowest p-container-padding gap-stack-gap-md">
                {[
                  { icon: "location-on" as const, label: "지역", value: listing?.region ?? "미정" },
                  {
                    icon: "apartment" as const,
                    label: "공급규모",
                    value: listing?.total_units != null
                      ? `총 ${listing.total_units.toLocaleString()}세대`
                      : "미정",
                  },
                  {
                    icon: "link" as const,
                    label: "출처",
                    value: listing?.source ?? "미정",
                  },
                ].map((row, i) => (
                  <View key={row.label}>
                    {i > 0 ? (
                      <View className="h-px w-full bg-surface-container-highest mb-stack-gap-md" />
                    ) : null}
                    <View className="flex-row items-start gap-3">
                      <MaterialIcons
                        name={row.icon}
                        size={22}
                        color={stitchColors.primary}
                        style={{ marginTop: 2 }}
                      />
                      <View className="flex-1">
                        <Text className="font-data-label text-data-label text-on-surface-variant">
                          {row.label}
                        </Text>
                        <Text className="font-body-main text-body-main text-on-surface">
                          {row.value}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="gap-stack-gap-lg">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="calendar-month" size={22} color={stitchColors.primary} />
                <Text className="font-section-header text-section-header text-on-background">
                  청약 일정
                </Text>
              </View>
              <View className="rounded-xl border border-outline-variant bg-surface-container-lowest p-container-padding">
                {[
                  { label: "청약 접수 시작", date: listing?.apply_start },
                  { label: "청약 접수 마감", date: listing?.apply_end },
                  { label: "당첨자 발표", date: listing?.winner_date },
                ].map((item, i, arr) => (
                  <View key={item.label} className="flex-row gap-4">
                    <View className="items-center" style={{ width: 24 }}>
                      <View
                        className={`h-6 w-6 items-center justify-center rounded-full ${
                          item.date ? "bg-primary" : "bg-surface-container-highest"
                        }`}>
                        <View
                          className={`h-2 w-2 rounded-full ${
                            item.date ? "bg-on-primary" : "bg-outline-variant"
                          }`}
                        />
                      </View>
                      {i < arr.length - 1 ? (
                        <View className="w-[2px] flex-1 bg-surface-container-highest" />
                      ) : null}
                    </View>
                    <View className={`flex-1 ${i < arr.length - 1 ? "pb-8" : ""}`}>
                      <Text className="mb-1 font-data-label text-data-label text-outline">
                        {formatDate(item.date ?? null)}
                      </Text>
                      <Text className="font-body-main text-body-main text-on-surface">
                        {item.label}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        <View className="flex-row items-center gap-3 border-t border-outline-variant bg-surface-container-lowest px-container-padding py-4">
          <Pressable onPress={toggleFavorite} className="w-12 items-center gap-1">
            <MaterialIcons
              name={favorited ? "favorite" : "favorite-border"}
              size={24}
              color={favorited ? stitchColors.error : stitchColors["on-surface-variant"]}
            />
            <Text className="text-[10px] font-medium text-on-surface-variant">관심</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/analysis")}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-primary py-3">
            <MaterialIcons name="analytics" size={20} color={stitchColors["on-primary"]} />
            <Text className="font-section-header text-section-header text-on-primary">
              AI 맞춤 리포트 보기
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
