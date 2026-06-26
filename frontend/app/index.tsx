// Novelty Wealth — single-screen mobile app.
// Navigation: stack-based with two root tabs (Home / NovaAI).
// User switcher reconfigures the whole app between Aarav (MF only) and Meera (Stocks + F&O).

import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { PROFILES } from "@/src/nw/data";
import { Btn, NWLogo, Pill } from "@/src/nw/primitives";
import {
  BookScreen,
  FnoScreen,
  GoalScreen,
  HomeScreen,
  NovaScreen,
  RebalanceScreen,
  SipScreen,
  TaxScreen,
} from "@/src/nw/screens";
import { darkTheme, lightTheme } from "@/src/nw/theme";

type Who = "aarav" | "meera";

export default function NoveltyWealthApp() {
  const [who, setWho] = useState<Who>("aarav");
  const [stack, setStack] = useState<string[]>(["home"]);
  const [pro, setPro] = useState(false);
  const [dark, setDark] = useState(false);

  const theme = dark ? darkTheme : lightTheme;
  const p = PROFILES[who];
  const view = stack[stack.length - 1];

  const go = (v: string) => setStack((s) => [...s, v]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const reset = (v: string) => {
    setStack([v]);
    setPro(false);
  };

  const insets = useSafeAreaInsets();

  const screen = useMemo(() => {
    switch (view) {
      case "home":
        return <HomeScreen p={p} go={go} openPro={() => setPro(true)} theme={theme} />;
      case "nova":
        return <NovaScreen p={p} theme={theme} />;
      case "rebalance":
        return <RebalanceScreen back={back} theme={theme} />;
      case "sip":
        return <SipScreen back={back} theme={theme} />;
      case "tax":
        return <TaxScreen back={back} theme={theme} />;
      case "goal":
        return <GoalScreen back={back} theme={theme} p={p} />;
      case "fno":
        return <FnoScreen back={back} theme={theme} />;
      case "book":
        return <BookScreen back={back} theme={theme} />;
      default:
        return <HomeScreen p={p} go={go} openPro={() => setPro(true)} theme={theme} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, who, theme]);

  const tabs: { key: string; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "nova", label: "NovaAI" },
  ];

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.surface }}
    >
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />

      {/* Sticky brand header */}
      <View
        style={[
          s.header,
          { backgroundColor: theme.card, borderBottomColor: theme.line },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 13, color: theme.slate }}>Good morning,</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: theme.ink }}>{p.name}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable
              onPress={() => setDark((d) => !d)}
              testID="theme-toggle-button"
              hitSlop={8}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.line,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.surface,
              }}
            >
              <Text style={{ fontSize: 16 }}>{dark ? "☀" : "☾"}</Text>
            </Pressable>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <NWLogo color={theme.ink} size={22} />
              <Text style={{ fontSize: 16, fontWeight: "800", color: theme.gold, letterSpacing: 0.2 }}>
                novelty
              </Text>
            </View>
          </View>
        </View>

        {/* User switcher */}
        <View
          style={{
            marginTop: 11,
            backgroundColor: theme.surface,
            borderRadius: 10,
            padding: 4,
            flexDirection: "row",
            gap: 4,
          }}
        >
          {(Object.entries(PROFILES) as [Who, typeof PROFILES.aarav][]).map(([k, v]) => {
            const active = who === k;
            return (
              <Pressable
                key={k}
                onPress={() => {
                  setWho(k);
                  reset("home");
                }}
                testID={`user-switcher-${k}`}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 7,
                  paddingHorizontal: 6,
                  backgroundColor: active ? theme.ink : "transparent",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: active ? (theme.mode === "dark" ? "#0E1726" : "#fff") : theme.slate,
                  }}
                >
                  {v.name}
                </Text>
                <Text
                  style={{
                    fontSize: 9.5,
                    fontWeight: "500",
                    opacity: 0.85,
                    color: active ? (theme.mode === "dark" ? "#0E1726" : "#fff") : theme.slate,
                  }}
                >
                  {v.short}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={{ fontSize: 10, color: theme.slate, marginTop: 6, textAlign: "center" }}>
          Demo — switch users to reconfigure the app
        </Text>
      </View>

      {/* Body */}
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        {view === "nova" ? (
          <View style={{ flex: 1, padding: 16 }}>{screen}</View>
        ) : (
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            key={view + who + theme.mode}
          >
            {screen}
          </ScrollView>
        )}
      </View>

      {/* Bottom tabs */}
      <View
        style={[
          s.tabBar,
          {
            backgroundColor: theme.card,
            borderTopColor: theme.line,
            paddingBottom: Math.max(insets.bottom - 8, 8),
          },
        ]}
      >
        {tabs.map((t) => {
          const active = view === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => reset(t.key)}
              testID={`tab-${t.key}`}
              style={{ flex: 1, alignItems: "center", paddingVertical: 13 }}
            >
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: active ? "700" : "500",
                  color: active ? theme.ink : theme.slate,
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* PRO bottom sheet */}
      <Modal visible={pro} transparent animationType="slide" onRequestClose={() => setPro(false)}>
        <Pressable
          style={s.modalBackdrop}
          onPress={() => setPro(false)}
          testID="pro-modal-backdrop"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[
              s.sheet,
              { backgroundColor: theme.card, paddingBottom: Math.max(insets.bottom + 12, 22) },
            ]}
          >
            <View style={{ width: 38, height: 4, backgroundColor: theme.line, borderRadius: 4, alignSelf: "center", marginBottom: 16 }} />
            <Pill color={theme.gold}>PRO</Pill>
            <Text style={{ fontSize: 18, fontWeight: "700", color: theme.ink, marginTop: 12 }}>{p.gated}</Text>
            <Text style={{ fontSize: 13, color: theme.slate, marginTop: 8, lineHeight: 19 }}>
              The exact moves to hit your target mix — refreshed as the market moves.
            </Text>
            <View
              style={{
                backgroundColor: theme.surface,
                borderRadius: 12,
                padding: 14,
                marginTop: 14,
              }}
            >
              <Text style={{ fontSize: 12, color: theme.slate }}>Sample step</Text>
              <Text
                style={{
                  fontSize: 13.5,
                  fontWeight: "600",
                  color: theme.ink,
                  marginTop: 3,
                  opacity: 0.35,
                }}
              >
                ████ ₹62,000 ████ Debt MF ████ UTI Nifty Index
              </Text>
            </View>
            <View style={{ marginTop: 16 }}>
              <Btn theme={theme} kind="gold" testID="pro-cta-button" onPress={() => setPro(false)}>
                See what Pro unlocks
              </Btn>
            </View>
            <Text style={{ textAlign: "center", fontSize: 11.5, color: theme.slate, marginTop: 10 }}>
              Shown because you reached a real limit.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(14,23,38,.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 22,
  },
});
