import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";

const TOTAL_MAX = 84;
const TOTAL_SCORE = 32;

const breakdown: { label: string; value: number; max: number; tone: "primary" | "tertiary" }[] = [
  { label: "무주택기간", value: 12, max: 32, tone: "primary" },
  { label: "부양가족", value: 5, max: 35, tone: "primary" },
  { label: "통장 가입기간", value: 15, max: 17, tone: "tertiary" },
];

function ScoreRing({ score, max }: { score: number; max: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / max);
  const size = 160;
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke={stitchColors["surface-container-highest"]}
          strokeWidth={12}
          fill="none"
        />
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke={stitchColors.primary}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <View className="flex-row items-baseline">
          <Text className="font-report-headline text-report-headline text-primary">{score}</Text>
          <Text className="text-on-surface-variant" style={{ fontSize: 18 }}>
            /{max}점
          </Text>
        </View>
        <Text className="mt-1 font-caption-caps text-caption-caps text-on-surface-variant">
          총점
        </Text>
      </View>
    </View>
  );
}

export default function ScoreScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <AppHeader />
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
          showsVerticalScrollIndicator={false}>
          <View>
            <Text className="font-report-headline text-report-headline text-on-surface mb-2">
              내 청약 가점
            </Text>
            <Text className="font-body-main text-body-main text-on-surface-variant">
              정확한 가점 계산으로 당첨 확률을 높이세요.
            </Text>
          </View>

          <View className="items-center rounded-xl border border-surface-variant bg-surface-container-lowest p-6">
            <ScoreRing score={TOTAL_SCORE} max={TOTAL_MAX} />
            <View className="mt-6 w-full flex-row items-start gap-2 rounded-lg border border-secondary-container bg-secondary-fixed/30 p-3">
              <MaterialIcons name="info" size={20} color={stitchColors.secondary} />
              <Text
                className="flex-1 font-data-label text-data-label text-on-surface"
                style={{ lineHeight: 20 }}>
                다음 달 가점이 <Text className="font-bold text-primary">1점 상승</Text>할 예정입니다.
              </Text>
            </View>
          </View>

          <View className="rounded-xl border border-surface-variant bg-surface-container-lowest p-6">
            <Text className="mb-6 font-section-header text-section-header text-on-surface">
              가점 상세 분석
            </Text>
            <View className="gap-stack-gap-md">
              {breakdown.map((b) => {
                const pct = Math.min(100, (b.value / b.max) * 100);
                return (
                  <View key={b.label}>
                    <View className="mb-2 flex-row items-end justify-between">
                      <Text className="font-data-label text-data-label text-on-surface-variant">
                        {b.label}
                      </Text>
                      <Text className="font-data-label text-data-label text-on-surface">
                        {b.value}점{" "}
                        <Text className="text-xs font-normal text-outline">/ {b.max}점</Text>
                      </Text>
                    </View>
                    <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                      <View
                        className={`h-full ${
                          b.tone === "primary" ? "bg-primary" : "bg-tertiary-fixed-dim"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="gap-stack-gap-sm">
            <Pressable
              onPress={() => router.push("/onboarding")}
              className="w-full items-center rounded-lg bg-primary py-3">
              <Text className="font-data-label text-data-label text-on-primary">
                프로필 수정하기
              </Text>
            </Pressable>
            <Pressable className="w-full items-center rounded-lg border border-outline py-3">
              <Text className="font-data-label text-data-label text-on-surface">
                개인정보 관리
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
