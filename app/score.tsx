import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { stitchColors } from "@/constants/theme";
import { api, ScoreResult } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const MAX = { total: 84, homeless: 32, dependents: 35, savings: 17 };

function ScoreBar({ value, max }: { value: number; max: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: max > 0 ? value / max : 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [value, max]);

  return (
    <View className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: stitchColors.primary,
          borderRadius: 999,
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
        }}
      />
    </View>
  );
}

export default function ScoreScreen() {
  const { session } = useAuth();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalcLoading, setRecalcLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    api.score
      .get()
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  async function recalculate() {
    setRecalcLoading(true);
    try {
      const r = await api.score.recalculate({});
      setResult(r);
    } catch (e) {
      console.error(e);
    } finally {
      setRecalcLoading(false);
    }
  }

  const score = result?.score;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <AppHeader />
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={stitchColors.primary} />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-container-padding pt-stack-gap-lg pb-section-margin gap-section-margin"
            showsVerticalScrollIndicator={false}>

            {result?.upcoming_alert && (
              <View className="flex-row items-center gap-3 rounded-xl border border-secondary-container bg-secondary-container/30 p-4">
                <MaterialIcons
                  name="notifications-active"
                  size={20}
                  color={stitchColors["on-secondary-container"]}
                />
                <Text className="flex-1 font-body-main text-body-main text-on-secondary-container">
                  {result.upcoming_alert.message}
                </Text>
              </View>
            )}

            <View className="items-center rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 gap-2">
              <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                청약 가점 총점
              </Text>
              <Text style={{ fontSize: 56, fontWeight: "800", color: stitchColors.primary }}>
                {score?.total ?? 0}
              </Text>
              <Text className="font-body-main text-body-main text-on-surface-variant">
                / {MAX.total}점 만점
              </Text>
              {result?.updated_at && (
                <Text className="font-caption-caps text-caption-caps text-outline mt-2">
                  {new Date(result.updated_at).toLocaleDateString("ko-KR")} 기준
                </Text>
              )}
            </View>

            <View className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 gap-5">
              <Text className="font-section-header text-section-header text-on-surface">
                항목별 상세 가점
              </Text>

              {[
                {
                  label: "무주택기간",
                  value: score?.homeless_score ?? 0,
                  max: MAX.homeless,
                  sub: score?.homeless_years != null ? `${score.homeless_years.toFixed(1)}년` : null,
                },
                {
                  label: "부양가족",
                  value: score?.dependents_score ?? 0,
                  max: MAX.dependents,
                  sub: null,
                },
                {
                  label: "청약통장 기간",
                  value: score?.savings_score ?? 0,
                  max: MAX.savings,
                  sub: score?.savings_months != null ? `${score.savings_months}개월` : null,
                },
              ].map(({ label, value, max, sub }) => (
                <View key={label} className="gap-2">
                  <View className="flex-row items-baseline justify-between">
                    <View>
                      <Text className="font-data-label text-data-label text-on-surface">{label}</Text>
                      {sub && (
                        <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                          {sub}
                        </Text>
                      )}
                    </View>
                    <Text className="font-data-label text-data-label">
                      <Text className="text-primary">{value}</Text>
                      <Text className="text-on-surface-variant"> / {max}</Text>
                    </Text>
                  </View>
                  <ScoreBar value={value} max={max} />
                </View>
              ))}
            </View>

            <Pressable
              onPress={recalculate}
              disabled={recalcLoading}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-outline py-3.5">
              {recalcLoading ? (
                <ActivityIndicator size="small" color={stitchColors.primary} />
              ) : (
                <MaterialIcons name="refresh" size={18} color={stitchColors.primary} />
              )}
              <Text className="font-data-label text-data-label text-primary">
                {recalcLoading ? "재계산 중..." : "가점 재계산"}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
