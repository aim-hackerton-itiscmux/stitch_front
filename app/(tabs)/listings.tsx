import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";

const filters = [
  { label: "아파트", active: true },
  { label: "민간분양", active: false },
  { label: "접수임박", active: false },
  { label: "500세대 이상", active: false },
];

type Listing = {
  title: string;
  region: string;
  dDay: string;
  dDayTone: "tertiary" | "primary" | "error";
  units: string;
  competition: string;
  tag?: { label: string; tone: "neutral" | "error" };
  recommended?: boolean;
};

const listings: Listing[] = [
  {
    title: "서초 리버포레",
    region: "서울 서초구",
    dDay: "D-6",
    dDayTone: "tertiary",
    units: "총 850세대",
    competition: "15:1",
    tag: { label: "고분양가", tone: "neutral" },
  },
  {
    title: "판교 센트럴파크",
    region: "경기 성남시",
    dDay: "D-12",
    dDayTone: "primary",
    units: "총 1,200세대",
    competition: "45:1",
    recommended: true,
  },
  {
    title: "광명 뉴타운 자이",
    region: "경기 광명시",
    dDay: "D-3",
    dDayTone: "error",
    units: "총 450세대",
    competition: "8:1",
    tag: { label: "위험신호", tone: "error" },
  },
];

const dDayClasses: Record<Listing["dDayTone"], string> = {
  tertiary: "bg-tertiary-container/20 text-tertiary",
  primary: "bg-primary/10 text-primary",
  error: "bg-error/10 text-error",
};

export default function ListingsScreen() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
        showsVerticalScrollIndicator={false}>
        <View>
          <View className="flex-row items-center rounded-full border border-outline-variant bg-surface-container-lowest pl-4">
            <MaterialIcons name="search" size={20} color={stitchColors.outline} />
            <TextInput
              placeholder="지역 또는 공고명을 입력하세요"
              placeholderTextColor={stitchColors["on-surface-variant"]}
              className="flex-1 px-3 py-3 text-body-main text-on-surface"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pb-2 pt-stack-gap-md">
            {filters.map((f) => (
              <Pressable
                key={f.label}
                className={`flex-row items-center rounded-full border px-4 py-2 ${
                  f.active
                    ? "border-primary bg-primary"
                    : "border-outline-variant bg-surface-container-lowest"
                }`}>
                <Text
                  className={`font-data-label text-data-label ${
                    f.active ? "text-on-primary" : "text-on-surface"
                  }`}>
                  {f.label}
                </Text>
                {f.active ? (
                  <MaterialIcons
                    name="close"
                    size={14}
                    color={stitchColors["on-primary"]}
                    style={{ marginLeft: 4 }}
                  />
                ) : null}
              </Pressable>
            ))}
            <Pressable className="flex-row items-center gap-1 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2">
              <MaterialIcons name="tune" size={14} color={stitchColors.outline} />
              <Text className="font-data-label text-data-label text-outline">필터 더보기</Text>
            </Pressable>
          </ScrollView>
        </View>

        <View className="gap-stack-gap-md">
          <View className="mb-2 flex-row items-end justify-between">
            <Text className="font-section-header text-section-header text-on-surface">
              진행중인 공고 <Text className="text-primary">3건</Text>
            </Text>
            <Pressable className="flex-row items-center gap-1">
              <Text className="font-data-label text-data-label text-on-surface-variant">
                마감임박순
              </Text>
              <MaterialIcons
                name="expand-more"
                size={16}
                color={stitchColors["on-surface-variant"]}
              />
            </Pressable>
          </View>

          {listings.map((l) => (
            <View
              key={l.title}
              className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
              {l.recommended ? (
                <View className="absolute right-0 top-0 flex-row items-center gap-1 rounded-bl-lg bg-primary px-3 py-1">
                  <MaterialIcons name="thumb-up" size={14} color={stitchColors["on-primary"]} />
                  <Text className="font-caption-caps text-caption-caps text-on-primary">추천</Text>
                </View>
              ) : null}

              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="mb-1 flex-row items-center gap-2">
                    <View className={`rounded px-2 py-0.5 ${dDayClasses[l.dDayTone].split(" ")[0]}`}>
                      <Text
                        className={`font-caption-caps text-caption-caps ${
                          dDayClasses[l.dDayTone].split(" ")[1]
                        }`}>
                        {l.dDay}
                      </Text>
                    </View>
                    <Text className="font-data-label text-data-label text-on-surface-variant">
                      {l.region}
                    </Text>
                  </View>
                  <Text className="font-report-headline text-report-headline text-on-surface">
                    {l.title}
                  </Text>
                </View>

                {l.tag ? (
                  <View
                    className={`flex-row items-center gap-1 rounded px-2 py-1 ${
                      l.tag.tone === "error" ? "bg-error/10" : "bg-surface-container"
                    }`}>
                    {l.tag.tone === "error" ? (
                      <MaterialIcons name="warning" size={14} color={stitchColors.error} />
                    ) : null}
                    <Text
                      className={`text-xs font-semibold ${
                        l.tag.tone === "error" ? "text-error" : "text-on-surface-variant"
                      }`}>
                      {l.tag.label}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View className="mb-5 flex-row gap-4 rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3">
                <View className="flex-1">
                  <Text className="mb-1 font-caption-caps text-caption-caps text-outline">
                    공급규모
                  </Text>
                  <Text className="font-data-label text-data-label text-on-surface">
                    {l.units}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-caption-caps text-caption-caps text-outline">
                    예상경쟁률
                  </Text>
                  <Text className="font-data-label text-data-label text-on-surface">
                    {l.competition}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Pressable className="flex-1 flex-row items-center justify-center gap-1 rounded-lg border border-secondary py-2.5">
                  <MaterialIcons name="bookmark-border" size={16} color={stitchColors.secondary} />
                  <Text className="font-data-label text-data-label text-secondary">관심 저장</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push("/listing-detail")}
                  className="flex-1 items-center rounded-lg bg-primary py-2.5">
                  <Text className="font-data-label text-data-label text-on-primary">상세 보기</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
