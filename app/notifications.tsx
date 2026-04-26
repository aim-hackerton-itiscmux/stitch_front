import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type Notice = {
  id: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  stripe?: "primary" | "tertiary";
  title: string;
  ageColor: string;
  age: string;
  body: string;
};

const unread: Notice[] = [
  {
    id: "n1",
    icon: "timer",
    iconBg: "bg-tertiary-fixed",
    iconColor: stitchColors["on-tertiary-fixed-variant"],
    stripe: "tertiary",
    title: "서초 리버포레 마감 D-7 알림",
    age: "2시간 전",
    ageColor: stitchColors["tertiary-container"],
    body: "서초 리버포레 1순위 청약 접수 마감이 7일 남았습니다. 경쟁률 분석 리포트가 업데이트 되었으니 가점 커트라인을 다시 확인해보세요.",
  },
  {
    id: "n2",
    icon: "campaign",
    iconBg: "bg-primary-fixed",
    iconColor: stitchColors["on-primary-fixed-variant"],
    stripe: "primary",
    title: "판교 센트럴파크 정정공고 알림",
    age: "5시간 전",
    ageColor: stitchColors.primary,
    body: "판교 센트럴파크 입주자모집공고 중 일부 내용이 정정되었습니다. 변경된 분양가 및 공급 세대수를 확인하세요.",
  },
];

const previous: Notice[] = [
  {
    id: "p1",
    icon: "trending-up",
    iconBg: "bg-surface-container-high",
    iconColor: stitchColors["on-surface-variant"],
    title: "다음 달 가점 상승 예정 알림",
    age: "어제",
    ageColor: stitchColors["on-surface-variant"],
    body: "무주택 기간 경과로 다음 달부터 청약 가점이 2점 상승할 예정입니다. 높아진 가점을 기반으로 새로운 추천 단지를 탐색해보세요.",
  },
  {
    id: "p2",
    icon: "assignment",
    iconBg: "bg-surface-container-high",
    iconColor: stitchColors["on-surface-variant"],
    title: "주민등록등본 준비 알림",
    age: "3일 전",
    ageColor: stitchColors["on-surface-variant"],
    body: "관심 단지로 등록한 '송파 힐스테이트'의 청약 예정일이 다가오고 있습니다. 원활한 접수를 위해 사전에 주민등록등본 등 필수 서류를 발급해 두시는 것을 권장합니다.",
  },
];

function NoticeCard({ n, dim = false }: { n: Notice; dim?: boolean }) {
  return (
    <View
      className={`relative overflow-hidden rounded-xl p-4 ${
        dim
          ? "bg-surface"
          : "border border-outline-variant bg-surface-container-lowest"
      }`}>
      {n.stripe ? (
        <View
          className={`absolute bottom-0 left-0 top-0 w-1 ${
            n.stripe === "primary" ? "bg-primary" : "bg-tertiary-container"
          }`}
        />
      ) : null}
      <View className="flex-row items-start gap-4">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${n.iconBg}`}>
          <MaterialIcons name={n.icon} size={22} color={n.iconColor} />
        </View>
        <View className="flex-1">
          <View className="mb-1 flex-row items-start justify-between">
            <Text
              numberOfLines={1}
              className="flex-1 font-data-label text-data-label text-on-background pr-2">
              {n.title}
            </Text>
            <Text
              className="font-caption-caps text-caption-caps shrink-0"
              style={{ color: n.ageColor }}>
              {n.age}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            className="font-body-main text-on-surface-variant"
            style={{ fontSize: 14, lineHeight: 22 }}>
            {n.body}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-outline-variant bg-surface px-5 h-16">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="notifications" size={22} color={stitchColors.primary} />
            <Text className="text-lg font-bold tracking-tighter text-on-surface">
              청약 코파일럿
            </Text>
          </View>
          <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
            <MaterialIcons
              name="person"
              size={18}
              color={stitchColors["on-surface-variant"]}
            />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-end justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-report-headline text-report-headline text-on-background">
                알림 센터
              </Text>
              <Text className="mt-1 font-body-main text-on-surface-variant" style={{ fontSize: 14 }}>
                청약 일정 및 중요한 업데이트를 확인하세요.
              </Text>
            </View>
            <Pressable className="flex-row items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2">
              <MaterialIcons name="done-all" size={16} color={stitchColors.secondary} />
              <Text className="font-data-label text-data-label text-secondary">모두 읽음</Text>
            </Pressable>
          </View>

          <View>
            <View className="mb-stack-gap-md flex-row items-center gap-2">
              <Text className="font-section-header text-section-header text-on-background">
                읽지 않은 알림
              </Text>
              <View className="rounded-full bg-error px-2 py-0.5">
                <Text className="font-caption-caps text-caption-caps text-on-error">
                  {unread.length}
                </Text>
              </View>
            </View>
            <View className="gap-stack-gap-sm">
              {unread.map((n) => (
                <NoticeCard key={n.id} n={n} />
              ))}
            </View>
          </View>

          <View>
            <Text className="mb-stack-gap-md font-section-header text-section-header text-on-surface-variant">
              이전 알림
            </Text>
            <View className="gap-stack-gap-sm" style={{ opacity: 0.85 }}>
              {previous.map((n) => (
                <NoticeCard key={n.id} n={n} dim />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
