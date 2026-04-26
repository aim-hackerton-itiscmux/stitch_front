import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type DocStatus = "needed" | "ready" | "expiring";

type Doc = {
  id: string;
  title: string;
  detail: string;
  status: DocStatus;
};

const docs: Doc[] = [
  {
    id: "resident",
    title: "주민등록등본",
    detail: "최근 3개월 이내 발급분",
    status: "needed",
  },
  {
    id: "family",
    title: "가족관계증명서",
    detail: "상세, 주민번호 뒷자리 포함",
    status: "ready",
  },
  {
    id: "savings",
    title: "청약통장 가입확인서",
    detail: "발급일: 2023.10.15",
    status: "expiring",
  },
];

const statusMeta: Record<
  DocStatus,
  { label: string; bgClass: string; textClass: string; icon: IconName; iconColor: string; cornerBg: string }
> = {
  needed: {
    label: "필요",
    bgClass: "bg-error-container",
    textClass: "text-on-error-container",
    icon: "error",
    iconColor: stitchColors.error,
    cornerBg: "bg-error-container/20",
  },
  ready: {
    label: "준비 완료",
    bgClass: "bg-primary/10",
    textClass: "text-primary",
    icon: "check-circle",
    iconColor: stitchColors.primary,
    cornerBg: "bg-primary-container/10",
  },
  expiring: {
    label: "만료 임박",
    bgClass: "bg-tertiary-container",
    textClass: "text-on-tertiary-container",
    icon: "warning",
    iconColor: stitchColors.tertiary,
    cornerBg: "bg-tertiary-container/20",
  },
};

function ActionRow({ status }: { status: DocStatus }) {
  if (status === "needed") {
    return (
      <View className="mt-4 flex-row gap-2">
        <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5">
          <MaterialIcons name="add" size={18} color={stitchColors["on-primary"]} />
          <Text className="font-data-label text-data-label text-on-primary">등록하기</Text>
        </Pressable>
      </View>
    );
  }
  if (status === "ready") {
    return (
      <View className="mt-4 flex-row gap-2">
        <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border border-outline-variant py-2.5">
          <MaterialIcons name="visibility" size={18} color={stitchColors["on-surface-variant"]} />
          <Text className="font-data-label text-data-label text-on-surface-variant">확인</Text>
        </Pressable>
        <Pressable className="w-10 items-center justify-center rounded-lg border border-outline-variant py-2.5">
          <MaterialIcons name="more-vert" size={18} color={stitchColors["on-surface-variant"]} />
        </Pressable>
      </View>
    );
  }
  return (
    <View className="mt-4 flex-row gap-2">
      <Pressable className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border border-tertiary py-2.5">
        <MaterialIcons name="update" size={18} color={stitchColors.tertiary} />
        <Text className="font-data-label text-data-label text-tertiary">갱신 필요</Text>
      </Pressable>
    </View>
  );
}

export default function MySubscriptionsScreen() {
  const ready = docs.filter((d) => d.status === "ready").length;
  const total = 5;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="font-report-headline text-report-headline text-on-surface mb-2">
            내 서류함
          </Text>
          <View className="flex-row items-center gap-1.5 self-start rounded-full border border-outline-variant bg-surface-container px-3 py-1.5">
            <MaterialIcons name="check-circle" size={16} color={stitchColors.primary} />
            <Text className="font-data-label text-data-label text-on-surface-variant">
              준비 완료 {ready} / 필수 {total}
            </Text>
          </View>
        </View>

        <View className="gap-4">
          {docs.map((d) => {
            const m = statusMeta[d.status];
            return (
              <View
                key={d.id}
                className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                <View
                  className={`absolute right-0 top-0 h-16 w-16 rounded-bl-full ${m.cornerBg}`}
                />
                <View className="mb-3 flex-row items-start justify-between">
                  <View className={`rounded px-2 py-1 ${m.bgClass}`}>
                    <Text className={`font-caption-caps text-caption-caps ${m.textClass}`}>
                      {m.label}
                    </Text>
                  </View>
                  <MaterialIcons name={m.icon} size={22} color={m.iconColor} />
                </View>
                <Text className="mb-1 font-section-header text-section-header text-on-surface">
                  {d.title}
                </Text>
                <Text className="font-data-label text-data-label text-on-surface-variant">
                  {d.detail}
                </Text>
                <ActionRow status={d.status} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
