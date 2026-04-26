import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type Highlight = {
  icon: IconName;
  iconColor: string;
  prefix: string;
  emphasis: string;
  emphasisColor: string;
  suffix: string;
};

const highlights: Highlight[] = [
  {
    icon: "check-circle",
    iconColor: stitchColors.primary,
    prefix: "주변 시세 대비 분양가가 약 15% 저렴하여 ",
    emphasis: "안전마진 확보가 가능",
    emphasisColor: stitchColors.primary,
    suffix: "합니다.",
  },
  {
    icon: "error",
    iconColor: stitchColors.error,
    prefix: "예상 경쟁률이 높아 ",
    emphasis: "가점 60점 이상",
    emphasisColor: stitchColors.error,
    suffix: "이어야 안정적인 당첨권에 듭니다.",
  },
  {
    icon: "warning",
    iconColor: stitchColors.tertiary,
    prefix: "계약금 20% 납부가 필요하여 초기 ",
    emphasis: "현금 1.8억 원 조달",
    emphasisColor: stitchColors.tertiary,
    suffix: "이 필수적입니다.",
  },
  {
    icon: "trending-up",
    iconColor: stitchColors.secondary,
    prefix: "향후 GTX 개통 호재로 ",
    emphasis: "장기적 가치 상승 여력",
    emphasisColor: stitchColors.secondary,
    suffix: "이 충분합니다.",
  },
  {
    icon: "fact-check",
    iconColor: stitchColors.primary,
    prefix: "고객님의 현재 무주택 기간 및 청약 통장 요건은 ",
    emphasis: "모두 충족",
    emphasisColor: stitchColors.primary,
    suffix: "된 상태입니다.",
  },
];

const checklist = [
  {
    title: "계약금(20%) 현금 1.8억 원 확보 방안 마련",
    detail: "마이너스 통장, 예적금 해지 등 자금 스케줄 확인",
  },
  {
    title: "청약홈 공동인증서 사전 등록 및 작동 확인",
    detail: "청약 당일 시스템 오류 대비",
  },
  {
    title: "해당 지역 거주기간 충족 증빙 서류 준비 (필요시)",
    detail: "당첨 후 서류 제출 기간 대비",
  },
];

export default function AnalysisScreen() {
  const [checked, setChecked] = useState<boolean[]>(checklist.map(() => false));

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
        showsVerticalScrollIndicator={false}>
        <View className="items-center">
          <Text className="font-report-headline text-report-headline text-on-surface mb-2 text-center">
            서초 리버포레 청약 분석 보고서
          </Text>
          <Text
            className="font-body-main text-on-surface-variant text-center"
            style={{ fontSize: 14 }}>
            AI 기반 맞춤형 청약 전략 분석 결과입니다.
          </Text>
        </View>

        <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
          <View className="absolute right-0 top-0 p-4 opacity-10">
            <MaterialIcons name="auto-awesome" size={96} color={stitchColors.primary} />
          </View>
          <View className="mb-4 flex-row items-center gap-3">
            <View className="flex-row items-center gap-1 rounded-full border border-tertiary-container/30 bg-tertiary-container/20 px-3 py-1">
              <MaterialIcons name="psychology" size={14} color={stitchColors["tertiary-container"]} />
              <Text className="font-caption-caps text-caption-caps text-tertiary-container">
                AI 분석 완료
              </Text>
            </View>
          </View>
          <Text className="mb-2 font-section-header text-section-header text-on-surface">
            최종 판단: <Text className="text-primary">조건부 추천</Text>
          </Text>
          <Text className="font-body-main text-body-main text-on-surface-variant">
            고객님의 현재 자금 상황과 가점을 고려할 때, 당첨 확률은 중간 수준이나 향후 시세 차익 기대치가
            높아 자금 조달 계획만 확실하다면 청약을 권장합니다.
          </Text>
        </View>

        <View>
          <View className="mb-stack-gap-md flex-row items-center gap-2">
            <MaterialIcons name="summarize" size={22} color={stitchColors.primary} />
            <Text className="font-section-header text-section-header text-on-surface">
              핵심 5줄 요약
            </Text>
          </View>
          <View className="gap-3">
            {highlights.map((h, i) => (
              <View
                key={i}
                className="flex-row items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
                <MaterialIcons
                  name={h.icon}
                  size={20}
                  color={h.iconColor}
                  style={{ marginTop: 2 }}
                />
                <Text
                  className="flex-1 font-body-main text-on-surface"
                  style={{ fontSize: 14, lineHeight: 22 }}>
                  {h.prefix}
                  <Text className="font-medium" style={{ color: h.emphasisColor }}>
                    {h.emphasis}
                  </Text>
                  {h.suffix}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <View className="mb-stack-gap-md flex-row items-center gap-2">
            <MaterialIcons name="rule" size={22} color={stitchColors.primary} />
            <Text className="font-section-header text-section-header text-on-surface">
              자격 요건 점검
            </Text>
          </View>
          <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            <View className="flex-row border-b border-outline-variant">
              <View className="flex-1 items-center justify-center p-4">
                <Text className="mb-1 font-data-label text-data-label text-on-surface-variant">
                  무주택 기간
                </Text>
                <Text className="font-section-header text-section-header text-on-surface">
                  5년 이상
                </Text>
                <View className="mt-1 rounded bg-primary/10 px-2 py-0.5">
                  <Text className="text-xs font-medium text-primary">충족</Text>
                </View>
              </View>
              <View className="w-px bg-outline-variant" />
              <View className="flex-1 items-center justify-center p-4">
                <Text className="mb-1 font-data-label text-data-label text-on-surface-variant">
                  청약통장 가입
                </Text>
                <Text className="font-section-header text-section-header text-on-surface">
                  48개월
                </Text>
                <View className="mt-1 rounded bg-primary/10 px-2 py-0.5">
                  <Text className="text-xs font-medium text-primary">충족 (1순위)</Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-start gap-3 bg-surface-container-low p-4">
              <MaterialIcons name="info" size={20} color={stitchColors.secondary} />
              <Text
                className="flex-1 font-body-main text-on-surface"
                style={{ fontSize: 14, lineHeight: 22 }}>
                해당 단지는 투기과열지구 내 민간분양으로, 세대주 요건 및 과거 5년 내 당첨 이력 없음을
                반드시 재확인하시기 바랍니다.
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View className="mb-stack-gap-md flex-row items-center gap-2">
            <MaterialIcons name="monitor" size={22} color={stitchColors.primary} />
            <Text className="font-section-header text-section-header text-on-surface">
              분양가 vs 주변 시세
            </Text>
          </View>
          <View className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <View className="mb-6 flex-row items-end justify-between border-b border-outline-variant pb-4">
              <View>
                <Text className="mb-1 font-data-label text-data-label text-on-surface-variant">
                  서초 리버포레 (84㎡)
                </Text>
                <Text className="font-report-headline text-report-headline text-on-surface">
                  9.5억
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-1 font-data-label text-data-label text-on-surface-variant">
                  인근 유사단지 평균
                </Text>
                <Text className="font-report-headline text-report-headline text-on-surface-variant">
                  11.2억
                </Text>
              </View>
            </View>
            <View>
              <View className="mb-1 flex-row justify-between">
                <Text className="text-xs font-medium text-on-surface-variant">예상 안전마진</Text>
                <Text className="text-xs font-medium text-primary">+1.7억 (15%)</Text>
              </View>
              <View className="h-2.5 w-full overflow-hidden rounded-full bg-surface-variant">
                <View className="h-full rounded-full bg-primary" style={{ width: "85%" }} />
              </View>
            </View>
            <View className="mt-4 flex-row items-center justify-between rounded-lg border border-secondary/10 bg-secondary/5 p-3">
              <Text
                className="font-body-main text-on-surface"
                style={{ fontSize: 14, lineHeight: 22 }}>
                AI 가격 경쟁력 평가
              </Text>
              <View className="rounded bg-secondary px-3 py-1">
                <Text className="font-caption-caps text-caption-caps text-on-secondary">우수</Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <View className="mb-stack-gap-md flex-row items-center gap-2">
            <MaterialIcons name="checklist" size={22} color={stitchColors.primary} />
            <Text className="font-section-header text-section-header text-on-surface">
              다음 단계 체크리스트
            </Text>
          </View>
          <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            {checklist.map((item, i) => (
              <Pressable
                key={item.title}
                onPress={() =>
                  setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                }
                className={`flex-row items-start gap-3 p-4 ${
                  i > 0 ? "border-t border-outline-variant" : ""
                }`}>
                <View
                  className={`mt-1 h-5 w-5 items-center justify-center rounded border ${
                    checked[i] ? "border-primary bg-primary" : "border-outline"
                  }`}>
                  {checked[i] ? (
                    <MaterialIcons name="check" size={14} color={stitchColors["on-primary"]} />
                  ) : null}
                </View>
                <View className="flex-1">
                  <Text className="font-data-label text-data-label text-on-surface">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-on-surface-variant">{item.detail}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mt-2 gap-4 border-t border-outline-variant pt-8">
          <Text
            className="px-4 text-center text-xs text-on-surface-variant"
            style={{ lineHeight: 18 }}>
            본 보고서는 AI 알고리즘 및 공공 데이터를 기반으로 작성되었으며, 실제 결과와 다를 수
            있습니다. 최종 청약 결정의 책임은 본인에게 있습니다.
          </Text>
          <View className="flex-row justify-center gap-3">
            <Pressable
              onPress={() => router.push("/evidence")}
              className="flex-row items-center gap-2 rounded-lg border border-outline px-4 py-2">
              <MaterialIcons name="find-in-page" size={18} color={stitchColors["on-surface"]} />
              <Text className="font-data-label text-data-label text-on-surface">근거 보기</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/prep")}
              className="flex-row items-center gap-2 rounded-lg bg-primary px-6 py-2">
              <Text className="font-data-label text-data-label text-on-primary">
                준비 체크리스트로 이동
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color={stitchColors["on-primary"]} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
