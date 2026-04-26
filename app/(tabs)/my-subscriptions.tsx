import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";
import { api, Favorite, Profile } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function daysUntil(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

export default function MySubscriptionsScreen() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    Promise.all([api.profile.get(), api.favorites.list()])
      .then(([p, f]) => {
        setProfile(p);
        const fAny = f as unknown as Record<string, Favorite[]> | Favorite[];
        setFavorites(Array.isArray(fAny) ? fAny : (fAny?.favorites ?? fAny?.data ?? fAny?.items ?? []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  async function removeFavorite(id: string) {
    await api.favorites.remove(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
        showsVerticalScrollIndicator={false}>

        {/* 프로필 헤더 */}
        <View className="flex-row items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MaterialIcons name="person" size={28} color={stitchColors.primary} />
          </View>
          <View className="flex-1">
            <Text className="font-section-header text-section-header text-on-surface">
              {profile?.nickname ?? session?.user?.email ?? "사용자"}
            </Text>
            <Text className="font-caption-caps text-caption-caps text-on-surface-variant mt-0.5">
              {session?.user?.email ?? ""}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/onboarding")}
            className="rounded-lg border border-outline-variant px-3 py-2">
            <Text className="font-caption-caps text-caption-caps text-on-surface-variant">프로필 수정</Text>
          </Pressable>
        </View>

        {/* 관심 공고 */}
        <View>
          <Text className="font-report-headline text-report-headline text-on-surface mb-stack-gap-md">
            관심 공고
          </Text>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator color={stitchColors.primary} />
            </View>
          ) : favorites.length === 0 ? (
            <View className="items-center rounded-xl border border-outline-variant bg-surface-container-lowest py-10 gap-3">
              <MaterialIcons name="bookmark-border" size={40} color={stitchColors["on-surface-variant"]} />
              <Text className="font-body-main text-body-main text-on-surface-variant">
                저장한 공고가 없습니다.
              </Text>
              <Pressable
                onPress={() => router.push("/listings")}
                className="rounded-lg bg-primary px-5 py-2.5">
                <Text className="font-data-label text-data-label text-on-primary">공고 둘러보기</Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-3">
              {favorites.map((fav) => {
                const ann = fav.announcement;
                if (!ann) return null;
                const dLabel = daysUntil(ann.apply_end ?? null);
                return (
                  <Pressable
                    key={fav.id}
                    onPress={() => router.push({ pathname: "/listing-detail", params: { id: ann.id } })}
                    className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        {dLabel && (
                          <View className="mb-1 self-start rounded bg-primary/10 px-2 py-0.5">
                            <Text className="font-caption-caps text-caption-caps text-primary">{dLabel}</Text>
                          </View>
                        )}
                        <Text className="font-section-header text-section-header text-on-surface" numberOfLines={2}>
                          {ann.title}
                        </Text>
                        <Text className="mt-1 font-caption-caps text-caption-caps text-on-surface-variant">
                          {ann.region} · {ann.housing_type ?? "분양"}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => removeFavorite(fav.id)}
                        className="p-1">
                        <MaterialIcons name="bookmark" size={22} color={stitchColors.secondary} />
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* 로그아웃 */}
        <Pressable
          onPress={signOut}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-outline-variant py-3.5">
          <MaterialIcons name="logout" size={18} color={stitchColors["on-surface-variant"]} />
          <Text className="font-data-label text-data-label text-on-surface-variant">로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
