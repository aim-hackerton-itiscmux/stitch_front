import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type Severity = "critical" | "warning" | "info";

type Item = {
  title: string;
  detail: string;
  severity: Severity;
  icon: IconName;
  badgeLabel: string;
};

const items: Item[] = [
  {
    title: "지역 우선공급",
    detail:
      "해당 거주지 요건(1년 이상 연속 거주) 충족 여부를 위해 정확한 전입일자 확인이 필요합니다.",
    severity: "critical",
    icon: "gpp-maybe",
    badgeLabel: "중요 확인",
  },
  {
    title: "소득 증빙",
    detail:
      "프리랜서 소득 신고 누락 가능성이 있습니다. 최근 1년 소득금액증명원 발급 후 확인 바랍니다.",
    severity: "warning",
    icon: "warning",
    badgeLabel: "주의",
  },
  {
    title: "통장 기간",
    detail: "청약통장 가입기간 24개월 이상으로 1순위 기본 요건은 충족된 상태입니다.",
    severity: "info",
    icon: "info",
    badgeLabel: "참고",
  },
];

const sevColors: Record<Severity, { stripe: string; icon: string; badgeBg: string; badgeText: string }> = {
  critical: {
    stripe: "bg-error",
    icon: stitchColors.error,
    badgeBg: "bg-error-container",
    badgeText: "text-on-error-container",
  },
  warning: {
    stripe: "bg-tertiary",
    icon: stitchColors.tertiary,
    badgeBg: "bg-tertiary-container",
    badgeText: "text-on-tertiary-container",
  },
  info: {
    stripe: "bg-secondary",
    icon: stitchColors.secondary,
    badgeBg: "bg-secondary-container",
    badgeText: "text-on-secondary-container",
  },
};

export default function PrescreenScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <AppHeader />
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
          showsVerticalScrollIndicator={false}>
          <View className="gap-stack-gap-md">
            <Text className="font-report-headline text-report-headline text-on-background">
              부적격 사전검증
            </Text>
            <View className="rounded-lg border border-primary/10 bg-primary-container p-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color={stitchColors["on-primary-container"]}
                  />
                  <Text className="font-section-header text-section-header text-on-primary-container">
                    신청 가능
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 rounded-full bg-tertiary px-3 py-1">
                  <MaterialIcons name="error" size={14} color={stitchColors["on-tertiary"]} />
                  <Text className="font-caption-caps text-caption-caps text-on-tertiary">
                    주의 2건
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View>
            <View className="relative flex-row items-start gap-4 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
              <View className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />
              <View className="mt-1 h-10 w-10 items-center justify-center rounded-full bg-secondary-container">
                <MaterialIcons
                  name="smart-toy"
                  size={22}
                  color={stitchColors["on-secondary-container"]}
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="font-caption-caps text-caption-caps font-bold tracking-wider text-secondary">
                  AI 분석 요약
                </Text>
                <Text
                  className="font-body-main text-body-main text-on-surface"
                  style={{ lineHeight: 24 }}>
                  현재 프로필 기준,{" "}
                  <Text className="rounded bg-error-container/30 font-bold text-error">
                    소득 증빙 서류 보완 시
                  </Text>{" "}
                  안전하게 신청 가능합니다.
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-stack-gap-md">
            <Text className="font-section-header text-section-header text-on-surface">
              검증 상세 내역
            </Text>
            <View className="gap-stack-gap-sm">
              {items.map((it) => {
                const c = sevColors[it.severity];
                return (
                  <View
                    key={it.title}
                    className="relative gap-2 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
                    <View className={`absolute left-0 right-0 top-0 h-[3px] ${c.stripe}`} />
                    <View className="mt-1 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <MaterialIcons name={it.icon} size={20} color={c.icon} />
                        <Text className="font-data-label text-data-label text-on-surface">
                          {it.title}
                        </Text>
                      </View>
                      <View className={`rounded px-2 py-0.5 ${c.badgeBg}`}>
                        <Text className={`font-caption-caps text-caption-caps ${c.badgeText}`}>
                          {it.badgeLabel}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="pl-7 font-body-main text-on-surface-variant"
                      style={{ fontSize: 14, lineHeight: 22 }}>
                      {it.detail}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)/my-subscriptions")}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-primary py-4">
            <MaterialIcons name="description" size={20} color={stitchColors["on-primary"]} />
            <Text className="font-section-header text-section-header text-on-primary">
              필요 서류 확인하기
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
