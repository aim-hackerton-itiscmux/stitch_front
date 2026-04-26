import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
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

type SocialProvider = "kakao" | "naver" | "google" | "apple";

const socials: { id: SocialProvider; label: string; bg: string; fg: string; icon: React.ComponentProps<typeof MaterialIcons>["name"] }[] = [
  { id: "kakao", label: "카카오로 시작하기", bg: "#FEE500", fg: "#191919", icon: "chat-bubble" },
  { id: "naver", label: "네이버로 시작하기", bg: "#03C75A", fg: "#ffffff", icon: "language" },
  { id: "google", label: "Google로 계속하기", bg: "#ffffff", fg: "#1f1f1f", icon: "account-circle" },
  { id: "apple", label: "Apple로 계속하기", bg: "#000000", fg: "#ffffff", icon: "phone-iphone" },
];

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.length > 0 && password.length > 0;

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

              <View>
                <Text className="mb-2 font-data-label text-data-label text-on-surface-variant">
                  비밀번호
                </Text>
                <View className="flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest pl-4">
                  <MaterialIcons name="lock-outline" size={20} color={stitchColors.outline} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="비밀번호를 입력하세요"
                    placeholderTextColor={stitchColors["on-surface-variant"]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    className="flex-1 px-3 py-3 text-body-main text-on-surface"
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    className="px-3 py-3"
                    accessibilityLabel={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}>
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color={stitchColors.outline}
                    />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row items-center justify-end">
                <Pressable>
                  <Text className="font-data-label text-data-label text-secondary">
                    비밀번호를 잊으셨나요?
                  </Text>
                </Pressable>
              </View>

              <Pressable
                disabled={!canSubmit}
                onPress={() => router.replace("/")}
                className={`w-full items-center justify-center rounded-lg py-3.5 ${
                  canSubmit ? "bg-primary" : "bg-surface-container-high"
                }`}>
                <Text
                  className={`font-section-header text-section-header ${
                    canSubmit ? "text-on-primary" : "text-on-surface-variant"
                  }`}>
                  로그인
                </Text>
              </Pressable>
            </View>

            <View className="gap-stack-gap-md">
              <View className="flex-row items-center gap-3">
                <View className="h-px flex-1 bg-outline-variant" />
                <Text className="font-caption-caps text-caption-caps text-on-surface-variant">
                  소셜 계정으로 계속하기
                </Text>
                <View className="h-px flex-1 bg-outline-variant" />
              </View>

              <View className="gap-stack-gap-sm">
                {socials.map((s) => (
                  <Pressable
                    key={s.id}
                    onPress={() => router.replace("/")}
                    className="flex-row items-center justify-center gap-2 rounded-lg py-3"
                    style={{
                      backgroundColor: s.bg,
                      borderWidth: s.id === "google" ? 1 : 0,
                      borderColor: stitchColors["outline-variant"],
                    }}>
                    <MaterialIcons name={s.icon} size={20} color={s.fg} />
                    <Text className="font-data-label text-data-label" style={{ color: s.fg }}>
                      {s.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row items-center justify-center gap-1">
              <Text className="font-body-main text-on-surface-variant" style={{ fontSize: 14 }}>
                아직 계정이 없으신가요?
              </Text>
              <Pressable onPress={() => router.push("/onboarding")}>
                <Text
                  className="font-data-label text-data-label text-primary"
                  style={{ fontSize: 14 }}>
                  회원가입
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
