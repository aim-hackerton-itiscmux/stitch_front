import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type Evidence = {
  icon: IconName;
  title: string;
  badge: { label: string; bgClass: string; textClass: string };
  quote: string;
  quoteAccent: "secondary" | "tertiary";
  cta: { label: string; icon: IconName };
};

const items: Evidence[] = [
  {
    icon: "description",
    title: "모집공고 원문",
    badge: { label: "p.12", bgClass: "bg-primary/10", textClass: "text-primary" },
    quote:
      "본 아파트는 투기과열지구 및 청약과열지역에서 공급하는 분양가상한제 적용 민영주택으로, 당첨 시 10년간 재당첨 제한이 적용되며 전매제한 기간은 3년입니다.",
    quoteAccent: "secondary",
    cta: { label: "원문 보기", icon: "arrow-forward-ios" },
  },
  {
    icon: "account-balance",
    title: "청약홈 기준 데이터",
    badge: {
      label: "자격요건",
      bgClass: "bg-surface-variant",
      textClass: "text-on-surface-variant",
    },
    quote:
      "서울특별시 2년 이상 계속 거주자 (해당지역) 100% 우선 공급. 무주택세대주 요건 충족 및 청약통장 가입기간 24개월 이상, 예치금 기준 금액 이상 충족 필수.",
    quoteAccent: "secondary",
    cta: { label: "청약홈 바로가기", icon: "open-in-new" },
  },
  {
    icon: "trending-up",
    title: "인근 실거래가 데이터",
    badge: {
      label: "시세비교",
      bgClass: "bg-tertiary-fixed/30",
      textClass: "text-on-tertiary-fixed-variant",
    },
    quote:
      "비교 대상 단지: 아크로리버파크 (2016년 입주). 전용면적 84㎡ 최근 실거래가 38억 5천만원 (국토교통부 실거래가 공개시스템, 2023.10 기준). 본 단지 예상 분양가 대비 안전마진 산정의 핵심 지표로 활용됨.",
    quoteAccent: "tertiary",
    cta: { label: "상세 데이터 보기", icon: "arrow-forward-ios" },
  },
];

export default function EvidenceScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: "modal" }} />
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-surface">
        <View className="border-b border-surface-container-high bg-surface-container-lowest px-container-padding pt-4 pb-2">
          <View className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-outline-variant/50" />
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 font-report-headline text-report-headline text-on-surface">
              서초 리버포레 분석 근거
            </Text>
            <Pressable
              onPress={() => router.back()}
              accessibilityLabel="닫기"
              className="h-8 w-8 items-center justify-center rounded-full bg-surface-container">
              <MaterialIcons name="close" size={20} color={stitchColors["on-surface-variant"]} />
            </Pressable>
          </View>
          <Text
            className="mt-2 font-data-label text-data-label text-on-surface-variant"
            style={{ fontSize: 14 }}>
            본 리포트의 예측 점수는 다음의 공식 데이터를 기반으로 산출되었습니다.
          </Text>
        </View>

        <ScrollView
          className="flex-1 bg-surface"
          contentContainerClassName="px-container-padding pt-stack-gap-md pb-section-margin gap-stack-gap-md"
          showsVerticalScrollIndicator={false}>
          {items.map((it) => (
            <View
              key={it.title}
              className="overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
              <View className="flex-row items-center justify-between border-b border-outline-variant/40 bg-surface-container-low px-4 py-3">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name={it.icon} size={20} color={stitchColors.secondary} />
                  <Text className="font-section-header text-on-surface" style={{ fontSize: 16 }}>
                    {it.title}
                  </Text>
                </View>
                <View className={`rounded-sm px-2 py-1 ${it.badge.bgClass}`}>
                  <Text className={`font-caption-caps text-caption-caps ${it.badge.textClass}`}>
                    {it.badge.label}
                  </Text>
                </View>
              </View>
              <View className="gap-4 p-4">
                <View
                  className={`rounded-r-md py-1 pl-4 ${
                    it.quoteAccent === "tertiary" ? "bg-tertiary-fixed/10" : "bg-background"
                  }`}
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor:
                      it.quoteAccent === "tertiary"
                        ? stitchColors["tertiary-fixed-dim"]
                        : stitchColors["secondary-fixed-dim"],
                  }}>
                  <Text
                    className="font-body-main text-on-surface-variant"
                    style={{ fontSize: 14, lineHeight: 22 }}>
                    “{it.quote}”
                  </Text>
                </View>
                <View className="flex-row justify-end">
                  <Pressable className="flex-row items-center gap-1">
                    <Text className="font-data-label text-data-label text-primary">
                      {it.cta.label}
                    </Text>
                    <MaterialIcons name={it.cta.icon} size={16} color={stitchColors.primary} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
