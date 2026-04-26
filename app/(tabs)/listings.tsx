import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";
import { api, Announcement } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function daysUntil(dateStr: string | null): { label: string; tone: "tertiary" | "primary" | "error" } {
  if (!dateStr) return { label: "일정미정", tone: "primary" };
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return { label: "마감", tone: "error" };
  if (diff === 0) return { label: "D-Day", tone: "error" };
  if (diff <= 5) return { label: `D-${diff}`, tone: "error" };
  if (diff <= 14) return { label: `D-${diff}`, tone: "tertiary" };
  return { label: `D-${diff}`, tone: "primary" };
}

const dDayClasses: Record<"tertiary" | "primary" | "error", string> = {
  tertiary: "bg-tertiary-container/20 text-tertiary",
  primary: "bg-primary/10 text-primary",
  error: "bg-error/10 text-error",
};

export default function ListingsScreen() {
  const { session } = useAuth();
  const [listings, setListings] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    api.announcements
      .list()
      .then(setListings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const filtered = query.trim()
    ? listings.filter(
        (l) =>
          l.title.includes(query) || (l.region ?? "").includes(query)
      )
    : listings;

  async function toggleFavorite(id: string) {
    if (favorites.has(id)) {
      setFavorites((prev) => { const s = new Set(prev); s.delete(id); return s; });
    } else {
      try {
        await api.favorites.add(id);
        setFavorites((prev) => new Set(prev).add(id));
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
        showsVerticalScrollIndicator={false}>

        <View>
          <View className="flex-row items-center rounded-full border border-outline-variant bg-surface-container-lowest pl-4">
            <MaterialIcons name="search" size={20} color={stitchColors.outline} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="지역 또는 공고명을 입력하세요"
              placeholderTextColor={stitchColors["on-surface-variant"]}
              className="flex-1 px-3 py-3 text-body-main text-on-surface"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} className="px-3">
                <MaterialIcons name="close" size={18} color={stitchColors.outline} />
              </Pressable>
            )}
          </View>
        </View>

        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color={stitchColors.primary} />
          </View>
        ) : (
          <View className="gap-stack-gap-md">
            <View className="mb-2 flex-row items-end justify-between">
              <Text className="font-section-header text-section-header text-on-surface">
                진행중인 공고{" "}
                <Text className="text-primary">{filtered.length}건</Text>
              </Text>
            </View>

            {filtered.length === 0 && (
              <Text className="text-center py-8 text-on-surface-variant font-body-main text-body-main">
                공고가 없습니다.
              </Text>
            )}

            {filtered.map((l) => {
              const { label: dLabel, tone } = daysUntil(l.apply_end);
              return (
                <View
                  key={l.id}
                  className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                  <View className="mb-4 flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                      <View className="mb-1 flex-row items-center gap-2">
                        <View className={`rounded px-2 py-0.5 ${dDayClasses[tone].split(" ")[0]}`}>
                          <Text className={`font-caption-caps text-caption-caps ${dDayClasses[tone].split(" ")[1]}`}>
                            {dLabel}
                          </Text>
                        </View>
                        <Text className="font-data-label text-data-label text-on-surface-variant">
                          {l.region ?? "지역미정"}
                        </Text>
                      </View>
                      <Text className="font-report-headline text-report-headline text-on-surface">
                        {l.title}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-5 flex-row gap-4 rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3">
                    <View className="flex-1">
                      <Text className="mb-1 font-caption-caps text-caption-caps text-outline">
                        공급규모
                      </Text>
                      <Text className="font-data-label text-data-label text-on-surface">
                        {l.total_units != null ? `총 ${l.total_units.toLocaleString()}세대` : "미정"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 font-caption-caps text-caption-caps text-outline">
                        유형
                      </Text>
                      <Text className="font-data-label text-data-label text-on-surface">
                        {l.housing_type ?? "분양"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={() => toggleFavorite(l.id)}
                      className="flex-1 flex-row items-center justify-center gap-1 rounded-lg border border-secondary py-2.5">
                      <MaterialIcons
                        name={favorites.has(l.id) ? "bookmark" : "bookmark-border"}
                        size={16}
                        color={stitchColors.secondary}
                      />
                      <Text className="font-data-label text-data-label text-secondary">
                        {favorites.has(l.id) ? "저장됨" : "관심 저장"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        router.push({ pathname: "/listing-detail", params: { id: l.id } })
                      }
                      className="flex-1 items-center rounded-lg bg-primary py-2.5">
                      <Text className="font-data-label text-data-label text-on-primary">
                        상세 보기
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
