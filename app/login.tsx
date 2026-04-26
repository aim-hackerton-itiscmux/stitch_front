import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stitchColors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

type Step = "email" | "otp";

export default function LoginScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    if (!email.trim()) return;
    setLoading(true);
    const redirectTo =
      process.env.EXPO_PUBLIC_SITE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    if (error) {
      Alert.alert("오류", error.message);
    } else {
      setStep("otp");
    }
  }

  async function verifyOtp() {
    if (!otp.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) {
      Alert.alert("인증 실패", error.message);
    }
    // AuthProvider handles redirect on session change
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}>
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-container-padding pt-section-margin pb-section-margin gap-section-margin"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            <View className="items-center gap-stack-gap-md mt-section-margin">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
                <MaterialIcons name="home-work" size={32} color={stitchColors["on-primary"]} />
              </View>
              <View className="items-center gap-1">
                <Text className="font-report-headline text-report-headline text-on-background">
                  청약 코파일럿
                </Text>
                <Text className="font-body-main text-on-surface-variant" style={{ fontSize: 14 }}>
                  AI가 도와주는 맞춤형 청약 어시스턴트
                </Text>
              </View>
            </View>

            {step === "email" ? (
              <View className="gap-stack-gap-md">
                <View>
                  <Text className="mb-2 font-data-label text-data-label text-on-surface-variant">
                    이메일
                  </Text>
                  <View className="flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest pl-4">
                    <MaterialIcons name="mail-outline" size={20} color={stitchColors.outline} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="example@email.com"
                      placeholderTextColor={stitchColors["on-surface-variant"]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      className="flex-1 px-3 py-3 text-body-main text-on-surface"
                    />
                  </View>
                </View>

                <Pressable
                  disabled={!email.trim() || loading}
                  onPress={sendOtp}
                  className={`w-full items-center justify-center rounded-lg py-3.5 ${
                    email.trim() && !loading ? "bg-primary" : "bg-surface-container-high"
                  }`}>
                  <Text
                    className={`font-section-header text-section-header ${
                      email.trim() && !loading ? "text-on-primary" : "text-on-surface-variant"
                    }`}>
                    {loading ? "전송 중..." : "인증 코드 받기"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="gap-stack-gap-md">
                <Text className="font-body-main text-on-surface-variant text-center" style={{ fontSize: 14 }}>
                  <Text className="text-on-surface font-bold">{email}</Text>
                  {"\n"}로 전송된 6자리 코드를 입력하세요.
                </Text>

                <View>
                  <Text className="mb-2 font-data-label text-data-label text-on-surface-variant">
                    인증 코드
                  </Text>
                  <View className="flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest pl-4">
                    <MaterialIcons name="pin" size={20} color={stitchColors.outline} />
                    <TextInput
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="123456"
                      placeholderTextColor={stitchColors["on-surface-variant"]}
                      keyboardType="number-pad"
                      maxLength={6}
                      className="flex-1 px-3 py-3 text-body-main text-on-surface"
                    />
                  </View>
                </View>

                <Pressable
                  disabled={otp.length < 6 || loading}
                  onPress={verifyOtp}
                  className={`w-full items-center justify-center rounded-lg py-3.5 ${
                    otp.length >= 6 && !loading ? "bg-primary" : "bg-surface-container-high"
                  }`}>
                  <Text
                    className={`font-section-header text-section-header ${
                      otp.length >= 6 && !loading ? "text-on-primary" : "text-on-surface-variant"
                    }`}>
                    {loading ? "확인 중..." : "로그인"}
                  </Text>
                </Pressable>

                <Pressable onPress={() => { setStep("email"); setOtp(""); }}>
                  <Text className="text-center font-data-label text-data-label text-secondary">
                    이메일 다시 입력
                  </Text>
                </Pressable>
              </View>
            )}

            <View className="flex-row items-center justify-center gap-1">
              <Text className="font-body-main text-on-surface-variant" style={{ fontSize: 14 }}>
                처음 방문이라면?
              </Text>
              <Pressable onPress={() => router.push("/onboarding")}>
                <Text className="font-data-label text-data-label text-primary" style={{ fontSize: 14 }}>
                  프로필 먼저 설정하기
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
