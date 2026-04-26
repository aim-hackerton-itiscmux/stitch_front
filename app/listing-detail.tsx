import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";

const basicInfo = [
  { icon: "location-on" as const, label: "위치", value: "서울특별시 서초구 반포동 123-45" },
  {
    icon: "apartment" as const,
    label: "규모",
    value: "지하 3층 ~ 지상 35층, 총 8개동 (일반분양 450세대)",
  },
  { icon: "payments" as const, label: "예상 분양가", value: "3.3㎡당 평균 6,500만원" },
];

const timeline = [
  { date: "2024. 11. 15 (금)", label: "입주자 모집공고", active: true },
  { date: "2024. 11. 25 (월)", label: "특별공급 청약", active: false },
  { date: "2024. 11. 26 (화)", label: "1순위 청약 (해당지역)", active: false },
  { date: "2024. 12. 04 (수)", label: "당첨자 발표", active: false },
];

const diagnosis = [
  {
    title: "신혼부부 특별공급 대상자 충족",
    detail: "혼인기간 7년 이내이며, 무주택세대구성원 요건을 만족합니다.",
  },
  {
    title: "소득 기준 (우선공급) 부합 예상",
    detail:
      "전년도 도시근로자 가구당 월평균소득 100% 이하(맞벌이 120%)로 우선공급 대상에 포함될 확률이 높습니다.",
  },
];

export default function ListingDetailScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <AppHeader />

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
          showsVerticalScrollIndicator={false}>
          <View className="gap-stack-gap-lg">
            <View className="gap-stack-gap-sm">
              <View className="flex-row items-center gap-2">
                <View className="rounded-full bg-tertiary-container px-2 py-1">
                  <Text className="font-caption-caps text-caption-caps text-on-tertiary-container">
                    D-5 청약예정
                  </Text>
                </View>
                <View className="rounded-full bg-surface-container-highest px-2 py-1">
                  <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                    민영주택
                  </Text>
                </View>
              </View>
              <Text className="font-report-headline text-report-headline text-on-background">
                서초 리버포레
              </Text>
            </View>

            <View className="rounded-xl border border-outline-variant bg-surface-container-lowest p-container-padding gap-stack-gap-md">
              {basicInfo.map((row, i) => (
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
              {timeline.map((item, i) => (
                <View key={item.date} className="flex-row gap-4">
                  <View className="items-center" style={{ width: 24 }}>
                    <View
                      className={`h-6 w-6 items-center justify-center rounded-full ${
                        item.active ? "bg-primary" : "bg-surface-container-highest"
                      }`}>
                      <View
                        className={`h-2 w-2 rounded-full ${
                          item.active ? "bg-on-primary" : "bg-outline-variant"
                        }`}
                      />
                    </View>
                    {i < timeline.length - 1 ? (
                      <View className="w-[2px] flex-1 bg-surface-container-highest" />
                    ) : null}
                  </View>
                  <View className={`flex-1 ${i < timeline.length - 1 ? "pb-8" : ""}`}>
                    <Text
                      className={`mb-1 font-data-label text-data-label ${
                        item.active ? "text-on-surface-variant" : "text-outline"
                      }`}>
                      {item.date}
                    </Text>
                    <Text
                      className={`font-body-main text-body-main ${
                        item.active ? "text-on-surface font-semibold" : "text-on-surface-variant"
                      }`}>
                      {item.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-stack-gap-lg">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="calculate" size={22} color={stitchColors.primary} />
              <Text className="font-section-header text-section-header text-on-background">
                나의 청약 가점 진단
              </Text>
            </View>
            <View className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-container-padding flex-row items-center justify-between">
              <View className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5" />
              <View className="z-10">
                <Text className="mb-1 font-data-label text-data-label text-on-surface-variant">
                  입력하신 정보 기반 추정 가점
                </Text>
                <Text className="font-body-main text-body-main text-on-surface">
                  일반공급 1순위 가점제 기준
                </Text>
              </View>
              <View className="z-10 flex-row items-baseline gap-1">
                <Text
                  className="font-bold text-primary tracking-tighter"
                  style={{ fontSize: 40, lineHeight: 40 }}>
                  32
                </Text>
                <Text className="font-data-label text-data-label text-on-surface-variant">점</Text>
              </View>
            </View>
          </View>

          <View className="gap-stack-gap-lg">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="assignment-ind" size={22} color={stitchColors.secondary} />
              <Text className="font-section-header text-section-header text-on-background">
                특별공급 자격 요약
              </Text>
            </View>
            <View
              className="rounded-xl border border-secondary/20 p-container-padding gap-stack-gap-md"
              style={{ backgroundColor: "#F0F4F9" }}>
              <View className="absolute right-4 top-4 rounded bg-secondary-container/50 px-2 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
                  AI 진단
                </Text>
              </View>
              {diagnosis.map((d) => (
                <View key={d.title} className="flex-row items-start gap-3">
                  <View className="mt-1 h-5 w-5 items-center justify-center rounded-full bg-secondary">
                    <MaterialIcons name="check" size={14} color={stitchColors["on-secondary"]} />
                  </View>
                  <View className="flex-1 pr-12">
                    <Text className="mb-1 font-data-label text-data-label text-on-surface font-bold">
                      {d.title}
                    </Text>
                    <Text
                      className="font-body-main text-on-surface-variant"
                      style={{ fontSize: 14, lineHeight: 22 }}>
                      {d.detail}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="flex-row items-center gap-3 border-t border-outline-variant bg-surface-container-lowest px-container-padding py-4">
          <Pressable className="w-12 items-center gap-1">
            <MaterialIcons
              name="favorite-border"
              size={24}
              color={stitchColors["on-surface-variant"]}
            />
            <Text className="text-[10px] font-medium text-on-surface-variant">관심</Text>
          </Pressable>
          <Pressable className="w-12 items-center gap-1 border-r border-outline-variant pr-3">
            <MaterialIcons
              name="compare-arrows"
              size={24}
              color={stitchColors["on-surface-variant"]}
            />
            <Text className="text-[10px] font-medium text-on-surface-variant">비교</Text>
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
