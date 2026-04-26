import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";

type Item = {
  id: string;
  title: string;
  detail: string;
  important?: boolean;
  initiallyChecked?: boolean;
};

type PrepSection = {
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  items: Item[];
};

const sections: PrepSection[] = [
  {
    badge: "D-14",
    badgeBg: "bg-tertiary-container",
    badgeText: "text-on-tertiary-container",
    title: "기본 준비",
    items: [
      {
        id: "deposit",
        title: "청약 통장 예치금 확인",
        detail: "모집공고일 전일까지 예치 완료해야 합니다.",
        initiallyChecked: true,
      },
      {
        id: "cert",
        title: "공동인증서/금융인증서 준비",
        detail: "청약홈 로그인 시 필수 항목입니다. 미리 갱신 여부를 확인하세요.",
      },
    ],
  },
  {
    badge: "D-3",
    badgeBg: "bg-secondary-container",
    badgeText: "text-on-secondary-container",
    title: "서류 및 결정",
    items: [
      {
        id: "docs",
        title: "필수 서류 발급 및 확인",
        detail: "주민등록등본, 가족관계증명서 등 (공고일 이후 발급분)",
        important: true,
      },
      {
        id: "type",
        title: "청약할 주택형(평형) 최종 결정",
        detail: "경쟁률 예측을 참고하여 1지망, 2지망을 결정하세요.",
      },
    ],
  },
  {
    badge: "D-DAY",
    badgeBg: "bg-error",
    badgeText: "text-on-error",
    title: "접수 당일",
    items: [
      {
        id: "submit",
        title: "청약홈 접속 및 접수 진행",
        detail: "오전 9시 ~ 오후 5시 30분 사이 접수 완료 필수",
      },
    ],
  },
];

export default function PrepScreen() {
  const initial: Record<string, boolean> = {};
  sections.forEach((s) =>
    s.items.forEach((it) => {
      initial[it.id] = !!it.initiallyChecked;
    }),
  );
  const [checked, setChecked] = useState<Record<string, boolean>>(initial);
  const total = Object.keys(initial).length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="font-report-headline text-report-headline text-on-surface mb-stack-gap-md">
            청약 준비 체크리스트
          </Text>
          <View className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-gap-md">
            <View className="mb-stack-gap-sm flex-row items-end justify-between">
              <View>
                <Text className="font-data-label text-data-label text-on-surface-variant">
                  전체 준비율
                </Text>
                <Text className="font-section-header text-section-header text-primary">{pct}%</Text>
              </View>
              <MaterialIcons
                name="emoji-events"
                size={32}
                color={stitchColors["tertiary-container"]}
              />
            </View>
            <View className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </View>
            <Text className="mt-stack-gap-sm text-right font-caption-caps text-caption-caps text-on-surface-variant">
              {pct >= 100 ? "준비 완료!" : pct >= 50 ? "거의 다 왔어요!" : "조금만 더 힘내세요!"}
            </Text>
          </View>
        </View>

        {sections.map((s) => (
          <View key={s.badge}>
            <View className="mb-stack-gap-md flex-row items-center gap-2">
              <View className={`rounded px-2 py-1 ${s.badgeBg}`}>
                <Text className={`font-caption-caps text-caption-caps ${s.badgeText}`}>
                  {s.badge}
                </Text>
              </View>
              <Text className="font-section-header text-section-header text-on-surface">
                {s.title}
              </Text>
            </View>
            <View className="gap-stack-gap-sm">
              {s.items.map((it) => {
                const isChecked = checked[it.id];
                return (
                  <Pressable
                    key={it.id}
                    onPress={() => setChecked((prev) => ({ ...prev, [it.id]: !prev[it.id] }))}
                    className="flex-row items-start rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-gap-md">
                    <View
                      className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${
                        isChecked ? "border-primary bg-primary" : "border-outline"
                      }`}>
                      {isChecked ? (
                        <MaterialIcons name="check" size={14} color={stitchColors["on-primary"]} />
                      ) : null}
                    </View>
                    <View className="ml-stack-gap-sm flex-1">
                      <View className="flex-row items-start justify-between">
                        <Text
                          className={`flex-1 font-body-main text-body-main ${
                            isChecked ? "text-on-surface-variant line-through" : "text-on-surface"
                          }`}>
                          {it.title}
                        </Text>
                        {it.important ? (
                          <View className="ml-2 rounded bg-error-container px-2 py-0.5">
                            <Text className="text-[10px] font-bold text-on-error-container">
                              중요
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Text className="mt-1 font-data-label text-data-label text-on-surface-variant">
                        {it.detail}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {s.badge === "D-DAY" ? (
              <Pressable
                onPress={() => Linking.openURL("https://www.applyhome.co.kr/")}
                className="mt-stack-gap-md w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary py-3">
                <Text className="font-section-header text-section-header text-on-primary">
                  청약홈 바로가기
                </Text>
                <MaterialIcons name="open-in-new" size={20} color={stitchColors["on-primary"]} />
              </Pressable>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
