import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type QuickAction = {
  label: string;
  icon: IconName;
  iconBgClass: string;
  iconColor: string;
  href: Parameters<typeof router.push>[0];
};

const quickActions: QuickAction[] = [
  {
    label: "통합 공고 조회",
    icon: "search",
    iconBgClass: "bg-primary/10",
    iconColor: stitchColors.primary,
    href: "/listings",
  },
  {
    label: "가점 계산",
    icon: "calculate",
    iconBgClass: "bg-tertiary/10",
    iconColor: stitchColors.tertiary,
    href: "/score",
  },
  {
    label: "AI 공고 분석",
    icon: "analytics",
    iconBgClass: "bg-secondary/10",
    iconColor: stitchColors.secondary,
    href: "/analysis",
  },
  {
    label: "서류함",
    icon: "folder-open",
    iconBgClass: "bg-surface-variant",
    iconColor: stitchColors["on-surface-variant"],
    href: "/my-subscriptions",
  },
];

const recommended = [
  {
    title: "서초 리버포레",
    region: "서울시 서초구 · 민영주택",
    badge: "관심",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDpmhXgONAGGbf5k8DqHglZoDYXoMqokmtcDpNpQ8SQ-IvlPla9yEVW5NOOjp1THhEEakWhFsmfeHtseGup2HiFuJSzsMRVhOmAMKgnKCS6DIpH25Auly-jNJbQdUdVN2WQ-tr7UgAtSGhP3PZYuKZexUURzKtimdqhUGueBLLG0TDkqh4DDwHzxlQT9sG7quRHQIDUd0Yq9-lxC8h0spY8xmzyzeWdEuVIvFxlsyJMU3Zk2UHOp7c_CKp2KTHkqVzWON_f_8zHmdD",
  },
  {
    title: "판교 센트럴파크",
    region: "성남시 분당구 · 국민주택",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC57oWo8dONi6FaBGRde5jjQZksMENDm7llX5wVcfcPK3yuEEWnH5Lc6HJMnD2hSeeNGFN-fWksYIWdgmem4BXwZtUz-jbw0cYhon_x43mLfR9sLYvqGSmDUvwyOl47-5TqpOf2bmn2mi1KnXURULfaaBfJk2bez4raF8D98h799JTDYBAX5MbZfyPnlWcrcVsF82iJyemoqGfbPdkpzFRvRUJFidsd403amSW81mSi280XCt1F4OhKg75syKgWSkMb9wQ1MYAhxfOh",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between border-b border-outline-variant bg-surface px-5 h-16">
        <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface-container">
          <MaterialIcons name="person" size={20} color={stitchColors["on-surface-variant"]} />
        </View>
        <Text className="text-lg font-bold tracking-tighter text-on-surface">청약 코파일럿</Text>
        <Pressable
          onPress={() => router.push("/notifications")}
          className="h-8 w-8 items-center justify-center rounded-full">
          <MaterialIcons name="notifications" size={22} color={stitchColors.primary} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-container-padding pt-stack-gap-md pb-section-margin"
        showsVerticalScrollIndicator={false}>
        <View className="mb-section-margin">
          <Text className="font-report-headline text-report-headline text-on-background mb-2">
            안녕하세요, 성호님.
          </Text>
          <Text className="font-body-main text-body-main text-on-surface-variant">
            오늘 확인할 청약 준비가 3개 있어요.
          </Text>
        </View>

        <Link href="/listing-detail" asChild>
          <Pressable className="mb-section-margin">
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
                    서초 리버포레 <Text className="text-primary">D-7</Text>
                  </Text>
                </View>
                <MaterialIcons name="event-available" size={28} color={stitchColors.primary} />
              </View>
              <Text className="font-body-main text-body-main text-on-surface-variant mb-6">
                모집공고 확인이 필요합니다.
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
        </Link>

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
                  <View
                    className={`h-10 w-10 items-center justify-center rounded-full ${a.iconBgClass}`}>
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

        <View className="-mx-container-padding">
          <Text className="font-section-header text-section-header text-on-surface mb-4 px-container-padding">
            추천 청약
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-container-padding gap-4 pb-2">
            {recommended.map((r) => (
              <Link key={r.title} href="/listing-detail" asChild>
                <Pressable className="w-[240px] rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                  <View className="mb-3 h-24 w-full overflow-hidden rounded-lg bg-surface-container-highest">
                    <Image
                      source={{ uri: r.image }}
                      style={{ width: "100%", height: "100%", opacity: 0.8 }}
                      contentFit="cover"
                    />
                  </View>
                  <View className="mb-1 flex-row items-center gap-2">
                    {r.badge ? (
                      <View className="rounded-sm bg-tertiary-fixed px-1.5 py-0.5">
                        <Text className="font-caption-caps text-caption-caps text-on-tertiary-fixed">
                          {r.badge}
                        </Text>
                      </View>
                    ) : null}
                    <Text className="font-data-label text-data-label text-on-surface">
                      {r.title}
                    </Text>
                  </View>
                  <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                    {r.region}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
