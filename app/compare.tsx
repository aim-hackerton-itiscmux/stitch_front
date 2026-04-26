import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type ComparisonRow = {
  icon: IconName;
  label: string;
  render: (col: 0 | 1) => React.ReactNode;
};

const data = [
  { name: "서초 리버포레", reco: "매우 높음", winner: true },
  { name: "판교 센트럴파크", reco: "보통", winner: false },
];

const rows: ComparisonRow[] = [
  {
    icon: "payments",
    label: "분양가 (84㎡ 기준)",
    render: (col) => {
      const txt = col === 0 ? "15억 3,000만" : "12억 8,000만";
      const sub = col === 0 ? "평당 4,500만" : "평당 3,800만";
      return (
        <View className="flex-1 items-center gap-1 px-2">
          <Text className="font-section-header text-section-header text-on-surface">{txt}</Text>
          <View className="rounded bg-surface-container px-2 py-0.5">
            <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
              {sub}
            </Text>
          </View>
        </View>
      );
    },
  },
  {
    icon: "location-on",
    label: "입지점수",
    render: (col) => {
      const score = col === 0 ? 98 : 85;
      const isPrimary = col === 0;
      return (
        <View className="flex-1 items-center gap-2 px-2">
          <View className="flex-row items-baseline gap-1">
            <Text
              className={`font-report-headline text-report-headline ${
                isPrimary ? "text-primary" : "text-on-surface"
              }`}>
              {score}
            </Text>
            <Text className="font-data-label text-data-label text-on-surface-variant">점</Text>
          </View>
          <View className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
            <View
              className={`h-full rounded-full ${isPrimary ? "bg-primary" : "bg-outline-variant"}`}
              style={{ width: `${score}%` }}
            />
          </View>
        </View>
      );
    },
  },
  {
    icon: "school",
    label: "학군 (접근성)",
    render: (col) => {
      const grade = col === 0 ? "S등급 (우수)" : "A등급 (양호)";
      const sub = col === 0 ? "초·중·고 도보 5분 이내" : "초등학교 인접, 중학교 버스";
      return (
        <View className="flex-1 items-center gap-1 px-2">
          <Text className="font-section-header text-section-header text-on-surface text-center">
            {grade}
          </Text>
          <Text
            className="font-body-main text-on-surface-variant text-center"
            style={{ fontSize: 14 }}>
            {sub}
          </Text>
        </View>
      );
    },
  },
  {
    icon: "directions-subway",
    label: "교통 환경",
    render: (col) => {
      const tags =
        col === 0
          ? [
              { l: "2호선", bg: "bg-secondary-container", fg: "text-on-secondary-container" },
              { l: "3호선", bg: "bg-tertiary-container", fg: "text-on-tertiary-container" },
            ]
          : [{ l: "신분당선", bg: "bg-surface-container-highest", fg: "text-on-surface" }];
      const sub = col === 0 ? "트리플 역세권" : "도보 12분 거리";
      return (
        <View className="flex-1 items-center gap-2 px-2">
          <View className="flex-row flex-wrap justify-center gap-1">
            {tags.map((t) => (
              <View key={t.l} className={`rounded px-2 py-1 ${t.bg}`}>
                <Text className={`font-caption-caps text-caption-caps ${t.fg}`}>{t.l}</Text>
              </View>
            ))}
          </View>
          <Text className="font-body-main text-body-main text-on-surface text-center">{sub}</Text>
        </View>
      );
    },
  },
];

export default function CompareScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-surface">
        <View className="flex-row items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-5 h-16">
          <Pressable onPress={() => router.back()} className="p-1">
            <MaterialIcons name="arrow-back" size={24} color={stitchColors["on-surface-variant"]} />
          </Pressable>
          <Text className="text-lg font-bold tracking-tighter text-on-surface">청약 코파일럿</Text>
          <Pressable onPress={() => router.push("/notifications")} className="p-1">
            <MaterialIcons
              name="notifications"
              size={24}
              color={stitchColors["on-surface-variant"]}
            />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-container-padding pt-stack-gap-md pb-section-margin gap-stack-gap-lg"
          showsVerticalScrollIndicator={false}>
          <View>
            <Text className="font-report-headline text-report-headline text-on-surface">
              공고 비교 분석
            </Text>
            <Text className="mt-1 font-body-main text-body-main text-on-surface-variant">
              선택하신 2개의 청약 단지 핵심 지표 비교
            </Text>
          </View>

          <View className="relative flex-row gap-stack-gap-md">
            <View className="flex-1 items-center overflow-hidden rounded-xl border-2 border-primary bg-primary/5 p-4">
              <View className="absolute left-0 right-0 top-0 h-1 bg-primary" />
              <View className="mb-3 flex-row items-center gap-1 rounded-full bg-tertiary px-2 py-1">
                <MaterialIcons name="emoji-events" size={12} color={stitchColors["on-tertiary"]} />
                <Text className="font-caption-caps text-caption-caps text-on-tertiary">
                  종합 1위
                </Text>
              </View>
              <Text className="font-section-header text-section-header text-on-surface">
                {data[0].name}
              </Text>
              <Text className="mt-1 font-data-label text-data-label text-primary">
                추천도: {data[0].reco}
              </Text>
            </View>

            <View className="flex-1 items-center rounded-xl border border-outline-variant bg-surface-container-lowest p-4 opacity-90">
              <View className="mb-3 h-6" />
              <Text className="font-section-header text-section-header text-on-surface">
                {data[1].name}
              </Text>
              <Text className="mt-1 font-data-label text-data-label text-on-surface-variant">
                추천도: {data[1].reco}
              </Text>
            </View>

            <View className="absolute left-1/2 top-1/2 -ml-4 -mt-4 h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface-container-high">
              <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                VS
              </Text>
            </View>
          </View>

          <View className="gap-stack-gap-sm">
            {rows.map((r) => (
              <View
                key={r.label}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                <View className="mb-4 flex-row items-center gap-2">
                  <MaterialIcons name={r.icon} size={18} color={stitchColors["on-surface-variant"]} />
                  <Text className="font-data-label text-data-label text-on-surface-variant">
                    {r.label}
                  </Text>
                </View>
                <View className="flex-row gap-4">
                  {r.render(0)}
                  <View className="w-px bg-outline-variant/30" />
                  {r.render(1)}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="border-t border-outline-variant bg-surface-container-lowest p-4">
          <Pressable className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary py-4">
            <MaterialIcons name="bookmark-add" size={22} color={stitchColors["on-primary"]} />
            <Text className="font-section-header text-section-header text-on-primary">
              비교 저장하기
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
