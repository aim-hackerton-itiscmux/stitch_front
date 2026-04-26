import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];
type Housing = "homeless" | "owner";
type FamilyType = "single" | "newlywed" | "multichild" | "parentsupport";

const housingOpts: { id: Housing; label: string }[] = [
  { id: "homeless", label: "무주택" },
  { id: "owner", label: "유주택" },
];

const familyOpts: { id: FamilyType; label: string }[] = [
  { id: "single", label: "미혼 (1인)" },
  { id: "newlywed", label: "신혼부부" },
  { id: "multichild", label: "다자녀" },
  { id: "parentsupport", label: "노부모 부양" },
];

const savingsRanges = [
  "선택해주세요",
  "6개월 미만",
  "6개월 이상 ~ 1년 미만",
  "1년 이상 ~ 2년 미만",
  "2년 이상 ~ 3년 미만",
  "3년 이상",
];

const savingsMonthsMap: Record<number, number> = {
  0: 0,
  1: 3,
  2: 9,
  3: 18,
  4: 30,
  5: 48,
};

function SectionCard({ icon, title, children }: { icon: IconName; title: string; children: React.ReactNode }) {
  return (
    <View className="rounded-xl border border-surface-container bg-surface-container-lowest p-5">
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialIcons name={icon} size={20} color={stitchColors.primary} />
        <Text className="font-section-header text-section-header text-on-surface">{title}</Text>
      </View>
      {children}
    </View>
  );
}

function RadioCell({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center rounded-lg border py-3 ${
        active ? "border-primary bg-primary-container/10" : "border-outline-variant"
      }`}>
      <Text className={`font-data-label text-data-label ${active ? "text-primary" : "text-on-surface-variant"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const { session } = useAuth();
  const [housing, setHousing] = useState<Housing>("homeless");
  const [family, setFamily] = useState<FamilyType>("single");
  const [savingsRangeIdx, setSavingsRangeIdx] = useState(4);
  const [contributions, setContributions] = useState("24");
  const [dependents, setDependents] = useState(0);
  const [saving, setSaving] = useState(false);

  async function handleNext() {
    if (!session) { router.replace("/login"); return; }
    setSaving(true);
    try {
      await api.profile.patch({
        has_home: housing === "owner",
        savings_months: savingsMonthsMap[savingsRangeIdx] ?? 0,
        dependents,
        onboarding_completed_at: new Date().toISOString(),
      });
      router.replace("/");
    } catch (e) {
      Alert.alert("저장 실패", String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-surface">
        <View className="flex-row items-center justify-between border-b border-surface-container bg-surface-container-lowest px-5 h-16">
          <Pressable onPress={() => router.back()} className="p-1">
            <MaterialIcons name="arrow-back" size={24} color={stitchColors.primary} />
          </Pressable>
          <Text className="text-lg font-bold tracking-tighter text-on-surface">청약 코파일럿</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-stack-gap-lg"
          showsVerticalScrollIndicator={false}>

          <View>
            <View className="mb-2 flex-row items-end justify-between">
              <Text className="font-data-label text-data-label text-primary">Step 1 / 1</Text>
              <Text className="font-caption-caps text-caption-caps text-outline">기본 조건 입력</Text>
            </View>
            <View className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <View className="h-full rounded-full bg-primary" style={{ width: "100%" }} />
            </View>
          </View>

          <View>
            <Text className="font-report-headline text-report-headline text-on-surface mb-2">
              청약 기본 조건을{"\n"}알려주세요
            </Text>
            <Text className="font-body-main text-body-main text-on-surface-variant">
              정확한 분석을 위해 현재 상태를 입력해주세요.
            </Text>
          </View>

          <SectionCard icon="home-work" title="무주택 여부">
            <View className="flex-row gap-3">
              {housingOpts.map((o) => (
                <RadioCell key={o.id} active={housing === o.id} label={o.label} onPress={() => setHousing(o.id)} />
              ))}
            </View>
          </SectionCard>

          <SectionCard icon="family-restroom" title="가구 유형">
            <View className="flex-row flex-wrap gap-3">
              {familyOpts.map((o) => (
                <View key={o.id} style={{ width: "48%" }}>
                  <RadioCell active={family === o.id} label={o.label} onPress={() => setFamily(o.id)} />
                </View>
              ))}
            </View>
          </SectionCard>

          <SectionCard icon="account-balance-wallet" title="청약통장 정보">
            <View className="gap-4">
              <View>
                <Text className="mb-2 font-data-label text-data-label text-on-surface-variant">가입 기간</Text>
                <View className="rounded-lg border border-outline-variant bg-surface">
                  {savingsRanges.map((r, i) => (
                    <Pressable
                      key={r}
                      onPress={() => setSavingsRangeIdx(i)}
                      className={`px-4 py-3 ${i < savingsRanges.length - 1 ? "border-b border-outline-variant" : ""} ${savingsRangeIdx === i ? "bg-primary-container/10" : ""}`}>
                      <Text className={`font-body-main text-body-main ${savingsRangeIdx === i ? "text-primary" : "text-on-surface"}`}>
                        {r}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View>
                <Text className="mb-2 font-data-label text-data-label text-on-surface-variant">납입 횟수</Text>
                <View className="flex-row items-center rounded-lg border border-outline-variant bg-surface px-4">
                  <TextInput
                    value={contributions}
                    onChangeText={setContributions}
                    keyboardType="number-pad"
                    placeholder="예: 24"
                    placeholderTextColor={stitchColors["on-surface-variant"]}
                    className="flex-1 py-3 font-body-main text-body-main text-on-surface"
                  />
                  <Text className="font-body-main text-body-main text-on-surface-variant">회</Text>
                </View>
              </View>
            </View>
          </SectionCard>

          <SectionCard icon="group" title="부양가족 수">
            <View className="flex-row items-center justify-between rounded-lg border border-outline-variant bg-surface p-2">
              <Pressable
                onPress={() => setDependents((n) => Math.max(0, n - 1))}
                className="h-10 w-10 items-center justify-center rounded-md border border-surface-container bg-surface-container-lowest">
                <MaterialIcons name="remove" size={22} color={stitchColors["on-surface"]} />
              </Pressable>
              <Text className="font-report-headline text-report-headline text-on-surface text-center" style={{ width: 64 }}>
                {dependents}
              </Text>
              <Pressable
                onPress={() => setDependents((n) => n + 1)}
                className="h-10 w-10 items-center justify-center rounded-md bg-primary">
                <MaterialIcons name="add" size={22} color={stitchColors["on-primary"]} />
              </Pressable>
            </View>
            <Text className="mt-3 text-center font-caption-caps text-caption-caps text-on-surface-variant">
              본인을 제외한 부양가족 수를 입력해주세요.
            </Text>
          </SectionCard>
        </ScrollView>

        <View className="flex-row gap-3 border-t border-surface-container bg-surface-container-lowest px-4 py-4">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 items-center rounded-lg border border-outline-variant bg-surface py-3.5">
            <Text className="font-section-header text-section-header text-on-surface">이전</Text>
          </Pressable>
          <Pressable
            onPress={handleNext}
            disabled={saving}
            className="flex-[2] items-center justify-center rounded-lg bg-primary py-3.5">
            {saving ? (
              <ActivityIndicator size="small" color={stitchColors["on-primary"]} />
            ) : (
              <Text className="font-section-header text-section-header text-on-primary">저장하고 시작하기</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
