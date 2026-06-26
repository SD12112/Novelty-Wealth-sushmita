// All detail screens. Imported by the root index.tsx and rendered via stack name.

import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";

import { blended, fv, inr, lakh, Profile } from "./data";
import {
  AnimatedNumber,
  Btn,
  Donut,
  GrowthCurve,
  Header,
  Icon,
  Pill,
  Ring,
  SplitBar,
} from "./primitives";
import { Theme } from "./theme";

const mixColorHex = (t: Theme, key: string) => {
  // Maps mix slice color tokens to hex strings on the active theme.
  const map: Record<string, string> = {
    gold: t.gold,
    grey: t.grey,
    navy: t.navy === "#0B1424" ? "#3A4866" : t.navy,
    red: t.red,
  };
  return map[key] ?? t.gold;
};

// ----- HOME -----

export function HomeScreen({
  p,
  go,
  openPro,
  theme,
}: {
  p: Profile;
  go: (v: string) => void;
  openPro: () => void;
  theme: Theme;
}) {
  const tone = { good: theme.green, warn: theme.red, info: theme.gold };
  const donutSegments = p.mix.map((m) => ({ pct: m.pct, colorHex: mixColorHex(theme, m.color as string) }));

  return (
    <View>
      {/* Value hero */}
      <LinearGradient
        colors={[theme.navy, theme.mode === "dark" ? "#06101F" : "#0B1424"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12.5, color: theme.subOnDark }}>Total portfolio</Text>
          <AnimatedNumber
            value={p.value}
            format={inr}
            style={{ fontSize: 28, fontWeight: "700", color: "#fff", letterSpacing: -0.5, marginTop: 2 }}
          />
          <Text style={{ fontSize: 13, color: p.up ? theme.posText : theme.negText, fontWeight: "600", marginTop: 3 }}>
            {p.up ? "+" : "−"}
            {inr(Math.abs(p.day))} · {p.pct > 0 ? "+" : ""}
            {p.pct}% today
          </Text>
        </View>
        <Donut segments={donutSegments} center={`${p.mix.length} types`} theme={theme} />
      </LinearGradient>

      {/* Insight card */}
      <Pressable
        onPress={() => go(p.insightTo)}
        testID="nova-insight-card"
        style={[s.card, { backgroundColor: theme.card, borderColor: theme.line }]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              backgroundColor: theme.gold,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>N</Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: "700", color: theme.slate, letterSpacing: 0.4 }}>
            NOVAAI · TODAY
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: theme.ink,
            lineHeight: 21,
            marginBottom: 14,
          }}
        >
          {p.insightHeadline}
        </Text>

        {p.key === "aarav" ? (
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Row left="Now" right="70/30" leftColor={theme.slate} rightColor={theme.slate} />
              <SplitBar pct={70} color={theme.grey} track={theme.line} />
              <View style={{ height: 10 }} />
              <Row left="Suggested" right="80/20" leftColor={theme.gold} rightColor={theme.gold} bold />
              <SplitBar pct={80} color={theme.gold} track={theme.line} />
            </View>
            <View style={{ alignItems: "center", minWidth: 78 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: theme.green }}>+{lakh(1400000)}</Text>
              <Text style={{ fontSize: 10.5, color: theme.slate }}>by 2040</Text>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                <Text style={{ fontSize: 11, color: theme.slate }}>Your limit 10%</Text>
                <Text style={{ fontSize: 11, color: theme.red, fontWeight: "700" }}>now 15%</Text>
              </View>
              <View>
                <SplitBar pct={75} color={theme.red} track={theme.line} h={10} />
                <View
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -3,
                    bottom: -3,
                    width: 2,
                    backgroundColor: theme.ink,
                  }}
                />
              </View>
            </View>
            <View style={{ alignItems: "center", minWidth: 60 }}>
              <Text style={{ fontSize: 24, fontWeight: "800", color: theme.red }}>+5%</Text>
              <Text style={{ fontSize: 10.5, color: theme.slate }}>over line</Text>
            </View>
          </View>
        )}

        <View
          style={{
            marginTop: 14,
            backgroundColor: theme.ink,
            borderRadius: 11,
            paddingVertical: 11,
            paddingHorizontal: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: theme.mode === "dark" ? "#0E1726" : "#fff" }}>
            {p.insightCta}
          </Text>
          <Text style={{ fontSize: 17, color: theme.mode === "dark" ? "#0E1726" : "#fff" }}>→</Text>
        </View>
      </Pressable>

      {/* Section label */}
      <Text style={[s.sectionLabel, { color: theme.slate }]}>YOUR PORTFOLIO</Text>

      {/* Tiles */}
      <View style={{ gap: 10, marginBottom: 16 }}>
        {p.tiles.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => go(t.to)}
            testID={`tile-${t.id}-button`}
            style={[s.tile, { backgroundColor: theme.card, borderColor: theme.line }]}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                backgroundColor: tone[t.tone] + "22",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={t.icon} color={tone[t.tone]} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 14.5, fontWeight: "700", color: theme.ink }}>{t.title}</Text>
              <Text style={{ fontSize: 12, color: theme.slate, marginTop: 1 }}>{t.sub}</Text>
            </View>
            {t.metric.kind === "ring" && (
              <Ring
                pct={t.metric.pct}
                color={t.metric.color === "green" ? theme.green : theme.gold}
                theme={theme}
              />
            )}
            {t.metric.kind === "frac" && (
              <Text style={{ fontWeight: "800", fontSize: 20, color: theme.ink }}>
                {t.metric.a}
                <Text style={{ color: theme.slate, fontSize: 14 }}>/{t.metric.b}</Text>
              </Text>
            )}
            {t.metric.kind === "amt" && (
              <Text
                style={{
                  fontWeight: "800",
                  fontSize: 20,
                  color: t.metric.color === "red" ? theme.red : theme.ink,
                }}
              >
                {t.metric.v}
              </Text>
            )}
            <Text style={{ color: theme.line, fontSize: 22, marginLeft: 6 }}>›</Text>
          </Pressable>
        ))}
      </View>

      {/* PRO gated row */}
      <Pressable
        onPress={openPro}
        testID="pro-gated-button"
        style={{
          backgroundColor: theme.goldSoft,
          borderColor: theme.gold + "55",
          borderWidth: 1,
          borderRadius: 14,
          padding: 14,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color: theme.ink }}>{p.gated}</Text>
        <Pill color={theme.gold}>PRO</Pill>
      </Pressable>

      {/* WhatsApp pulse */}
      <View
        style={{
          marginTop: 14,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: theme.line,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: "#25D36622",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#1FA855", fontWeight: "800", fontSize: 15 }}>W</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12.5, color: theme.ink, fontWeight: "600" }}>{p.pulse}</Text>
          <Text style={{ fontSize: 10.5, color: theme.slate, marginTop: 1 }}>
            WhatsApp pulse · only when it matters
          </Text>
        </View>
      </View>
    </View>
  );
}

function Row({
  left,
  right,
  leftColor,
  rightColor,
  bold,
}: {
  left: string;
  right: string;
  leftColor: string;
  rightColor: string;
  bold?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
      <Text style={{ fontSize: 11, color: leftColor, fontWeight: bold ? "700" : "400" }}>{left}</Text>
      <Text style={{ fontSize: 11, color: rightColor, fontWeight: bold ? "700" : "400" }}>{right}</Text>
    </View>
  );
}

// ----- REBALANCE -----

export function RebalanceScreen({ back, theme }: { back: () => void; theme: Theme }) {
  const [equity, setEquity] = useState(70);
  const m = 15000;
  const y = 14;
  const base = fv(m, y, blended(70));
  const corpus = fv(m, y, blended(equity));
  const delta = corpus - base;
  const max = fv(m, y, blended(90)) * 1.05;

  return (
    <View>
      <Header title="Model your mix" onBack={back} theme={theme} />
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.line, padding: 18 }]}>
        <Text style={{ fontSize: 12.5, color: theme.slate }}>Corpus by 2040</Text>
        <Text style={{ fontSize: 34, fontWeight: "700", color: theme.ink, marginTop: 2, marginBottom: 6 }}>
          {lakh(corpus)}
        </Text>
        <Pill color={delta >= 0 ? theme.green : theme.red}>
          {delta >= 0 ? "+" : "−"}
          {lakh(Math.abs(delta))} vs 70/30
        </Pill>

        <View style={{ marginTop: 16, marginBottom: 6 }}>
          <GrowthCurve corpus={base} max={max} color={theme.slate} faint />
          <View style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
            <GrowthCurve corpus={corpus} max={max} color={theme.gold} />
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: theme.ink }}>Equity {equity}%</Text>
          <Text style={{ fontSize: 13, color: theme.slate }}>Debt {100 - equity}%</Text>
        </View>

        <Slider
          minimumValue={50}
          maximumValue={90}
          step={1}
          value={equity}
          onValueChange={setEquity}
          minimumTrackTintColor={theme.gold}
          maximumTrackTintColor={theme.line}
          thumbTintColor={theme.gold}
          testID="rebalance-slider"
        />

        <Text
          style={{
            fontSize: 12,
            color: theme.slate,
            marginTop: 10,
            lineHeight: 18,
            backgroundColor: theme.surface,
            padding: 11,
            borderRadius: 10,
          }}
        >
          {equity >= 80
            ? "Same risk band you lived through in 2022. NovaAI can phase the switch over 3 months."
            : "Drag toward 80% to see the trade-off."}
        </Text>
      </View>
      <View style={{ marginTop: 14 }}>
        <Btn theme={theme} testID="rebalance-phase-button">
          Phase over 3 months
        </Btn>
      </View>
      <Text style={{ textAlign: "center", fontSize: 11.5, color: theme.slate, marginTop: 10 }}>
        NovaAI proposes — you confirm.
      </Text>
    </View>
  );
}

// ----- SIP -----

export function SipScreen({ back, theme }: { back: () => void; theme: Theme }) {
  const [retried, setRetried] = useState(false);
  const sips = [
    { n: "Parag Parikh Flexi Cap", a: 8000, ok: true },
    { n: "UTI Nifty 50 Index", a: 4000, ok: true },
    { n: "Mirae ELSS Tax Saver", a: 3000, ok: false },
  ];
  return (
    <View>
      <Header title="SIP health" onBack={back} theme={theme} />
      <View style={{ gap: 10 }}>
        {sips.map((sip) => {
          const fixed = !sip.ok && retried;
          return (
            <View
              key={sip.n}
              style={[s.card, { backgroundColor: theme.card, borderColor: theme.line, padding: 14 }]}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: theme.ink }}>{sip.n}</Text>
                  <Text style={{ fontSize: 12.5, color: theme.slate, marginTop: 2 }}>{inr(sip.a)}/mo</Text>
                </View>
                <Pill color={sip.ok || fixed ? theme.green : theme.red}>
                  {sip.ok ? "On track" : fixed ? "Retry queued" : "Failed 5th"}
                </Pill>
              </View>
              {!sip.ok && !fixed && (
                <View style={{ marginTop: 12 }}>
                  <Btn
                    theme={theme}
                    kind="gold"
                    onPress={() => setRetried(true)}
                    testID={`sip-retry-${sip.n.split(" ")[0].toLowerCase()}-button`}
                  >
                    Retry · {inr(sip.a)}
                  </Btn>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ----- TAX -----

export function TaxScreen({ back, theme }: { back: () => void; theme: Theme }) {
  const [amt, setAmt] = useState(40000);
  return (
    <View>
      <Header title="Use your 80C gap" onBack={back} theme={theme} />
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.line, padding: 18 }]}>
        <Text style={{ fontSize: 12.5, color: theme.slate }}>Tax saved this year</Text>
        <Text style={{ fontSize: 34, fontWeight: "700", color: theme.green }}>{inr(amt * 0.3)}</Text>
        <Text style={{ fontSize: 13, color: theme.ink, fontWeight: "600", marginTop: 16, marginBottom: 6 }}>
          Invest {inr(amt)} in ELSS
        </Text>
        <Slider
          minimumValue={5000}
          maximumValue={40000}
          step={5000}
          value={amt}
          onValueChange={setAmt}
          minimumTrackTintColor={theme.gold}
          maximumTrackTintColor={theme.line}
          thumbTintColor={theme.gold}
          testID="tax-slider"
        />
        <Text
          style={{
            fontSize: 12,
            color: theme.slate,
            marginTop: 12,
            lineHeight: 18,
            backgroundColor: theme.surface,
            padding: 11,
            borderRadius: 10,
          }}
        >
          ₹40k left in your ₹1.5L limit · ELSS has the shortest lock-in, 3 years.
        </Text>
      </View>
      <View style={{ marginTop: 14 }}>
        <Btn theme={theme} testID="tax-start-elss-button">
          Start ELSS
        </Btn>
      </View>
    </View>
  );
}

// ----- GOAL -----

export function GoalScreen({ back, theme, p }: { back: () => void; theme: Theme; p: Profile }) {
  const house = p.key === "meera";
  const [extra, setExtra] = useState(0);
  const base = house ? 58 : 62;
  const progress = Math.min(100, base + (extra / 8000) * (house ? 30 : 18));
  const ahead = progress >= (house ? 80 : 70);
  return (
    <View>
      <Header title={house ? "House 2028" : "Retirement 2040"} onBack={back} theme={theme} />
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.line, padding: 18 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 13, color: theme.slate }}>Funded</Text>
          <Text style={{ fontSize: 13, fontWeight: "700", color: theme.ink }}>{Math.round(progress)}%</Text>
        </View>
        <View
          style={{
            height: 12,
            backgroundColor: theme.surface,
            borderRadius: 8,
            overflow: "hidden",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: ahead ? theme.green : theme.gold,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
            backgroundColor: theme.surface,
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: theme.ink }}>Top up SIP</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Pressable
              onPress={() => setExtra((e) => Math.max(0, e - 2000))}
              testID="goal-decrease-button"
              style={[s.stepper, { borderColor: theme.line, backgroundColor: theme.card }]}
            >
              <Text style={{ fontSize: 18, color: theme.ink }}>−</Text>
            </Pressable>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: theme.ink,
                minWidth: 64,
                textAlign: "center",
              }}
            >
              {inr(extra)}
            </Text>
            <Pressable
              onPress={() => setExtra((e) => e + 2000)}
              testID="goal-increase-button"
              style={[s.stepper, { borderColor: theme.line, backgroundColor: theme.card }]}
            >
              <Text style={{ fontSize: 18, color: theme.ink }}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 14 }}>
        <Btn theme={theme} testID="goal-confirm-button">
          {extra > 0 ? `Add ${inr(extra)}/mo` : "Set a top-up"}
        </Btn>
      </View>
    </View>
  );
}

// ----- F&O -----

export function FnoScreen({ back, theme }: { back: () => void; theme: Theme }) {
  const [closed, setClosed] = useState(false);
  const exposure = closed ? 8 : 15;
  const overLimit = exposure > 10;
  return (
    <View>
      <Header title="F&O risk" onBack={back} theme={theme} />
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.line, padding: 18 }]}>
        <Text style={{ fontSize: 12.5, color: theme.slate }}>Exposure</Text>
        <Text style={{ fontSize: 34, fontWeight: "700", color: overLimit ? theme.red : theme.green }}>
          {exposure}%
        </Text>
        <View
          style={{
            height: 10,
            backgroundColor: theme.surface,
            borderRadius: 6,
            overflow: "hidden",
            marginTop: 12,
            marginBottom: 4,
            position: "relative",
          }}
        >
          <View
            style={{
              width: `${exposure * 5}%`,
              height: "100%",
              backgroundColor: overLimit ? theme.red : theme.green,
            }}
          />
          <View
            style={{
              position: "absolute",
              left: "50%",
              top: -2,
              bottom: -2,
              width: 2,
              backgroundColor: theme.ink,
            }}
          />
        </View>
        <Text style={{ fontSize: 10.5, color: theme.slate }}>line = your 10% limit</Text>
      </View>

      {[
        { n: "NIFTY 24500 CE", v: "₹1.7L" },
        { n: "NIFTY 24300 PE", v: "₹1.0L" },
      ].map((pos, i) => (
        <View
          key={pos.n}
          style={[
            s.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.line,
              padding: 14,
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: theme.ink }}>{pos.n}</Text>
            <Text style={{ fontSize: 12, color: theme.slate, marginTop: 2 }}>Expiry Thu · {pos.v}</Text>
          </View>
          {i === 0 &&
            (closed ? (
              <Pill color={theme.green}>Closed</Pill>
            ) : (
              <Pressable
                onPress={() => setClosed(true)}
                testID="fno-close-position-button"
                style={{
                  borderWidth: 1,
                  borderColor: theme.red,
                  backgroundColor: theme.redSoft,
                  borderRadius: 9,
                  paddingHorizontal: 11,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 12.5, fontWeight: "700", color: theme.red }}>Close</Text>
              </Pressable>
            ))}
        </View>
      ))}

      <Text
        style={{
          fontSize: 12,
          color: theme.slate,
          lineHeight: 18,
          backgroundColor: theme.surface,
          padding: 12,
          borderRadius: 11,
          marginTop: 12,
        }}
      >
        {closed
          ? "Back inside your 10% line."
          : "Closing the larger position puts you back under your limit."}
      </Text>
    </View>
  );
}

// ----- BOOK PROFITS -----

export function BookScreen({ back, theme }: { back: () => void; theme: Theme }) {
  const stocks = [
    { n: "Titan", g: "+38%" },
    { n: "ICICI Bank", g: "+24%" },
    { n: "L&T", g: "+31%" },
  ];
  const [pick, setPick] = useState<Record<string, boolean>>({});
  const count = Object.values(pick).filter(Boolean).length;
  return (
    <View>
      <Header title="Booking opportunity" onBack={back} theme={theme} />
      {stocks.map((stock) => {
        const sel = !!pick[stock.n];
        return (
          <Pressable
            key={stock.n}
            onPress={() => setPick((p) => ({ ...p, [stock.n]: !p[stock.n] }))}
            testID={`book-${stock.n.toLowerCase().replace(/\s|&/g, "")}-toggle`}
            style={[
              s.card,
              {
                backgroundColor: theme.card,
                borderColor: sel ? theme.gold : theme.line,
                padding: 14,
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: theme.ink }}>{stock.n}</Text>
              <Text style={{ fontSize: 12, color: theme.green, marginTop: 2, fontWeight: "600" }}>
                {stock.g} unrealised
              </Text>
            </View>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: sel ? theme.gold : theme.line,
                backgroundColor: sel ? theme.gold : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {sel && <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>✓</Text>}
            </View>
          </Pressable>
        );
      })}
      <Btn theme={theme} kind={count ? "dark" : "ghost"} testID="book-confirm-button">
        {count ? `Book 25% of ${count}` : "Select to book"}
      </Btn>
    </View>
  );
}

// ----- NOVA CHAT -----

export function NovaScreen({ p, theme }: { p: Profile; theme: Theme }) {
  const meera = p.key === "meera";
  const initial = meera
    ? "Today's dip is F&O, not your stocks — two index positions. Walk through them?"
    : "Nothing urgent today. One thing: your debt mix is high for your age. See what 80/20 does?";
  const [msgs, setMsgs] = useState<{ from: "ai" | "me"; t: string }[]>([{ from: "ai", t: initial }]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [msgs, typing]);

  const chips = meera
    ? ["Show the positions", "Over-diversified?", "Book the highs?"]
    : ["What would 80/20 do?", "Is ELSS enough?", "On track for 2040?"];

  const reply = meera
    ? "Two NIFTY weeklies, ~₹2.7L notional — that's what pushed you past 10%. Close the larger one and you're back inside for a small loss. One-tap ticket?"
    : "80/20 adds ~₹14L by 2040 vs 70/30, with drawdowns you've seen before. I can phase it over 3 months. Set it up?";

  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "ai", t: reply }]);
    }, 850);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {msgs.map((m, i) => (
          <View
            key={i}
            style={{
              alignSelf: m.from === "me" ? "flex-end" : "flex-start",
              maxWidth: "84%",
              backgroundColor: m.from === "me" ? theme.ink : theme.card,
              borderWidth: m.from === "me" ? 0 : 1,
              borderColor: theme.line,
              borderRadius: 14,
              paddingHorizontal: 13,
              paddingVertical: 11,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                lineHeight: 19,
                color: m.from === "me" ? (theme.mode === "dark" ? "#0E1726" : "#fff") : theme.ink,
              }}
            >
              {m.t}
            </Text>
          </View>
        ))}
        {typing && (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.line,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 16, color: theme.slate, letterSpacing: 2 }}>···</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 7, paddingVertical: 10, paddingHorizontal: 2, alignItems: "center" }}
        >
          {chips.map((c) => (
            <Pressable
              key={c}
              onPress={() => send(c)}
              testID={`nova-chip-${c.split(" ")[0].toLowerCase()}`}
              style={{
                borderWidth: 1,
                borderColor: theme.line,
                backgroundColor: theme.card,
                borderRadius: 999,
                paddingHorizontal: 11,
                paddingVertical: 7,
                flexShrink: 0,
              }}
            >
              <Text style={{ color: theme.ink, fontSize: 12 }}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 4,
        }}
      >
        <TextInput
          placeholder="Ask NovaAI…"
          placeholderTextColor={theme.slate}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
          testID="nova-input"
          style={{
            flex: 1,
            fontSize: 13,
            color: theme.ink,
            paddingVertical: 8,
          }}
        />
        <Pressable
          onPress={() => send(input)}
          testID="nova-send-button"
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: theme.gold,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  hero: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginTop: 2,
    marginBottom: 10,
    marginHorizontal: 2,
  },
  tile: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  stepper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
