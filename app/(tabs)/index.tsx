import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";
import { api, Profile, RecommendedAnnouncement } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];
type QuickAction = {
  label: string;
  icon: IconName;
  iconBgClass: string;
  iconColor: string;
  href: Parameters<typeof router.push>[0];
};

const quickActions: QuickAction[] = [
  { label: "통합 공고 조회", icon: "search", iconBgClass: "bg-primary/10", iconColor: stitchColors.primary, href: "/listings" },
  { label: "가점 계산", icon: "calculate", iconBgClass: "bg-tertiary/10", iconColor: stitchColors.tertiary, href: "/score" },
  { label: "AI 공고 분석", icon: "analytics", iconBgClass: "bg-secondary/10", iconColor: stitchColors.secondary, href: "/analysis" },
  { label: "서류함", icon: "folder-open", iconBgClass: "bg-surface-variant", iconColor: stitchColors["on-surface-variant"], href: "/my-subscriptions" },
];

function daysUntil(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

export default function HomeScreen() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommended, setRecommended] = useState<RecommendedAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    Promise.all([api.profile.get(), api.recommendations.list()])
      .then(([p, r]) => {
        setProfile(p);
        const rAny = r as unknown as Record<string, RecommendedAnnouncement[]> | RecommendedAnnouncement[];
        setRecommended(Array.isArray(rAny) ? rAny : (rAny?.recommendations ?? rAny?.data ?? rAny?.items ?? []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const nickname = profile?.nickname ?? "사용자";
  const topAlert = recommended[0] ?? null;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-outline-variant bg-surface px-5 h-16">
        <Pressable
          onPress={() => router.push("/my-subscriptions")}
          className="h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface-container">
          <MaterialIcons name="person" size={20} color={stitchColors["on-surface-variant"]} />
        </Pressable>
        <Text className="text-lg font-bold tracking-tighter text-on-surface">청약 코파일럿</Text>
        <Pressable
          onPress={() => router.push("/notifications")}
          className="h-8 w-8 items-center justify-center rounded-full">
          <MaterialIcons name="notifications" size={22} color={stitchColors.primary} />
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={stitchColors.primary} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-container-padding pt-stack-gap-md pb-section-margin"
          showsVerticalScrollIndicator={false}>

          <View className="mb-section-margin">
            <Text className="font-report-headline text-report-headline text-on-background mb-2">
              안녕하세요, {nickname}님.
            </Text>
            <Text className="font-body-main text-body-main text-on-surface-variant">
              {recommended.length > 0
                ? `맞춤 추천 공고 ${recommended.length}건이 있어요.`
                : "오늘 확인할 청약 준비를 시작해보세요."}
            </Text>
          </View>

          {topAlert && (
            <Pressable
              onPress={() => router.push({ pathname: "/listing-detail", params: { id: topAlert.id } })}
              className="mb-section-margin">
              <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                <View className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-fixed-dim/20" />
                <View className="mb-4 flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <View className="mb-2 self-start rounded bg-secondary-fixed/50 px-2 py-1">
                      <Text className="font-caption-caps text-caption-caps text-on-secondary-container">
                        주요 알림
                      </Text>
                    </View>
                    <Text className="font-section-header text-section-header text-on-surface">
                      {topAlert.title}{" "}
                      {topAlert.apply_end ? (
                        <Text className="text-primary">{daysUntil(topAlert.apply_end)}</Text>
                      ) : null}
                    </Text>
                  </View>
                  <MaterialIcons name="event-available" size={28} color={stitchColors.primary} />
                </View>
                <Text className="font-body-main text-body-main text-on-surface-variant mb-6">
                  {topAlert.match_reason ?? "모집공고 확인이 필요합니다."}
                </Text>
                <Pressable
                  onPress={() => router.push("/analysis")}
                  className="w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary py-3">
                  <MaterialIcons name="smart-toy" size={18} color={stitchColors["on-primary"]} />
                  <Text className="font-data-label text-data-label text-on-primary">
                    AI로 공고 분석하기
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          )}

          <View className="mb-section-margin">
            <Text className="font-section-header text-section-header text-on-surface mb-4">
              빠른 실행
            </Text>
            <View className="flex-row flex-wrap -mx-2">
              {quickActions.map((a) => (
                <View key={a.label} className="basis-1/2 p-2">
                  <Pressable
                    onPress={() => router.push(a.href)}
                    className="aspect-square items-center justify-center gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
                    <View className={`h-10 w-10 items-center justify-center rounded-full ${a.iconBgClass}`}>
                      <MaterialIcons name={a.icon} size={20} color={a.iconColor} />
                    </View>
                    <Text className="font-data-label text-data-label text-on-surface text-center">
                      {a.label}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {recommended.length > 0 && (
            <View className="-mx-container-padding">
              <Text className="font-section-header text-section-header text-on-surface mb-4 px-container-padding">
                추천 청약
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="px-container-padding gap-4 pb-2">
                {recommended.map((r) => (
                  <Pressable
                    key={r.id}
                    onPress={() => router.push({ pathname: "/listing-detail", params: { id: r.id } })}
                    className="w-[240px] rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                    <View className="mb-3 h-24 w-full overflow-hidden rounded-lg bg-surface-container-highest items-center justify-center">
                      <MaterialIcons name="apartment" size={40} color={stitchColors["on-surface-variant"]} />
                    </View>
                    <View className="mb-1 flex-row items-center gap-2">
                      {r.match_score >= 80 ? (
                        <View className="rounded-sm bg-tertiary-fixed px-1.5 py-0.5">
                          <Text className="font-caption-caps text-caption-caps text-on-tertiary-fixed">
                            추천
                          </Text>
                        </View>
                      ) : null}
                      <Text className="font-data-label text-data-label text-on-surface flex-1" numberOfLines={1}>
                        {r.title}
                      </Text>
                    </View>
                    <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                      {r.region} · {r.housing_type ?? "분양"}
                    </Text>
                    {r.apply_end && (
                      <Text className="mt-1 font-caption-caps text-caption-caps text-primary">
                        {daysUntil(r.apply_end)}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
