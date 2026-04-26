import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";
import { api, ChecklistItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

// fallback static checklist when no announcement is linked
const DEFAULT_SECTIONS = [
  {
    badge: "D-14",
    badgeBg: "bg-tertiary-container",
    badgeText: "text-on-tertiary-container",
    title: "기본 준비",
    items: [
      { id: "deposit", label: "청약 통장 예치금 확인", detail: "모집공고일 전일까지 예치 완료" },
      { id: "cert", label: "공동인증서/금융인증서 준비", detail: "청약홈 로그인 시 필수 항목" },
    ],
  },
  {
    badge: "D-3",
    badgeBg: "bg-secondary-container",
    badgeText: "text-on-secondary-container",
    title: "서류 및 결정",
    items: [
      { id: "docs", label: "필수 서류 발급 및 확인", detail: "주민등록등본, 가족관계증명서 등" },
      { id: "type", label: "청약할 주택형(평형) 최종 결정", detail: "경쟁률 예측 참고" },
    ],
  },
  {
    badge: "D-DAY",
    badgeBg: "bg-error",
    badgeText: "text-on-error",
    title: "접수 당일",
    items: [
      { id: "submit", label: "청약홈 접속 및 접수 진행", detail: "오전 9시 ~ 오후 5시 30분" },
    ],
  },
];

export default function PrepScreen() {
  const { session } = useAuth();
  const [apiItems, setApiItems] = useState<ChecklistItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session) return;
    api.preparation
      .get()
      .then((data) => {
        if (data?.items?.length) {
          setApiItems(data.items);
          const init: Record<string, boolean> = {};
          data.items.forEach((it) => { init[it.id] = it.done; });
          setChecked(init);
        }
      })
      .catch(() => {
        // fallback to static checklist
        const init: Record<string, boolean> = {};
        DEFAULT_SECTIONS.forEach((s) => s.items.forEach((it) => { init[it.id] = false; }));
        setChecked(init);
      })
      .finally(() => setLoading(false));
  }, [session]);

  async function toggle(id: string) {
    const next = !checked[id];
    setChecked((prev) => ({ ...prev, [id]: next }));

    if (apiItems) {
      const updated = apiItems.map((it) =>
        it.id === id ? { ...it, done: next } : it
      );
      setApiItems(updated);
      try {
        await api.preparation.patch(updated);
      } catch {
        // revert on failure
        setChecked((prev) => ({ ...prev, [id]: !next }));
      }
    }
  }

  // Flatten apiItems into sections if present, otherwise use static
  const sections = apiItems
    ? [{ badge: "", badgeBg: "bg-primary/10", badgeText: "text-primary", title: "전체 체크리스트", items: apiItems.map((it) => ({ id: it.id, label: it.label, detail: it.due_date ?? "" })) }]
    : DEFAULT_SECTIONS.flatMap((s) => [s]);

  const allItems = sections.flatMap((s) => s.items);
  const total = allItems.length;
  const done = allItems.filter((it) => checked[it.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

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
                <Text className="font-data-label text-data-label text-on-surface-variant">전체 준비율</Text>
                <Text className="font-section-header text-section-header text-primary">{pct}%</Text>
              </View>
              <MaterialIcons name="emoji-events" size={32} color={stitchColors["tertiary-container"]} />
            </View>
            <View className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </View>
            <Text className="mt-stack-gap-sm text-right font-caption-caps text-caption-caps text-on-surface-variant">
              {pct >= 100 ? "준비 완료!" : pct >= 50 ? "거의 다 왔어요!" : "조금만 더 힘내세요!"}
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center py-8">
            <ActivityIndicator color={stitchColors.primary} />
          </View>
        ) : (
          sections.map((s) => (
            <View key={s.badge || s.title}>
              <View className="mb-stack-gap-md flex-row items-center gap-2">
                {s.badge ? (
                  <View className={`rounded px-2 py-1 ${s.badgeBg}`}>
                    <Text className={`font-caption-caps text-caption-caps ${s.badgeText}`}>{s.badge}</Text>
                  </View>
                ) : null}
                <Text className="font-section-header text-section-header text-on-surface">{s.title}</Text>
              </View>
              <View className="gap-stack-gap-sm">
                {s.items.map((it) => {
                  const isChecked = !!checked[it.id];
                  return (
                    <Pressable
                      key={it.id}
                      onPress={() => toggle(it.id)}
                      className="flex-row items-start rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-gap-md">
                      <View className={`mt-0.5 h-5 w-5 items-center justify-center rounded border ${isChecked ? "border-primary bg-primary" : "border-outline"}`}>
                        {isChecked ? <MaterialIcons name="check" size={14} color={stitchColors["on-primary"]} /> : null}
                      </View>
                      <View className="ml-stack-gap-sm flex-1">
                        <Text className={`font-body-main text-body-main ${isChecked ? "text-on-surface-variant line-through" : "text-on-surface"}`}>
                          {it.label}
                        </Text>
                        {it.detail ? (
                          <Text className="mt-1 font-data-label text-data-label text-on-surface-variant">
                            {it.detail}
                          </Text>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {s.badge === "D-DAY" || (apiItems && s.title === "전체 체크리스트" && done === total && total > 0) ? (
                <Pressable
                  onPress={() => Linking.openURL("https://www.applyhome.co.kr/")}
                  className="mt-stack-gap-md w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary py-3">
                  <Text className="font-section-header text-section-header text-on-primary">청약홈 바로가기</Text>
                  <MaterialIcons name="open-in-new" size={20} color={stitchColors["on-primary"]} />
                </Pressable>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
