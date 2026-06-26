// Visual primitives: AnimatedNumber, Ring, SplitBar, Donut, GrowthCurve, Pill, Btn, Icon.

import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

import { Theme } from "./theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function AnimatedNumber({
  value,
  format,
  style,
}: {
  value: number;
  format: (v: number) => string;
  style?: any;
}) {
  const [display, setDisplay] = useState(value);
  const anim = useRef(new Animated.Value(0)).current;
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    anim.setValue(0);
    const id = anim.addListener(({ value: v }) => {
      setDisplay(from + (value - from) * v);
    });
    Animated.timing(anim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      prev.current = value;
    });
    return () => anim.removeListener(id);
  }, [value, anim]);

  return <Text style={style}>{format(display)}</Text>;
}

export function Ring({
  pct,
  color,
  size = 48,
  stroke = 6,
  theme,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
  theme: Theme;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const len = (pct / 100) * c;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.line} strokeWidth={stroke} />
      <G rotation={-90} originX={size / 2} originY={size / 2}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${len} ${c - len}`}
        />
      </G>
      <SvgText
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight="700"
        fill={theme.ink}
      >
        {pct}%
      </SvgText>
    </Svg>
  );
}

export function SplitBar({
  pct,
  color,
  track,
  h = 9,
}: {
  pct: number;
  color: string;
  track: string;
  h?: number;
}) {
  return (
    <View style={{ height: h, borderRadius: h, overflow: "hidden", backgroundColor: track, width: "100%" }}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", backgroundColor: color }} />
    </View>
  );
}

export function Donut({
  segments,
  size = 88,
  stroke = 12,
  center,
  theme,
}: {
  segments: { pct: number; colorHex: string }[];
  size?: number;
  stroke?: number;
  center?: string;
  theme: Theme;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <Svg width={size} height={size}>
      <G rotation={-90} originX={size / 2} originY={size / 2}>
        {segments.map((s, i) => {
          const len = (s.pct / 100) * c;
          const el = (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.colorHex}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-off}
            />
          );
          off += len;
          return el;
        })}
      </G>
      {center ? (
        <SvgText
          x={size / 2}
          y={size / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fontWeight="700"
          fill={theme.mode === "dark" ? "#fff" : "#fff"}
        >
          {center}
        </SvgText>
      ) : null}
    </Svg>
  );
}

export function GrowthCurve({
  width = 280,
  height = 88,
  corpus,
  max,
  color,
  faint,
}: {
  width?: number;
  height?: number;
  corpus: number;
  max: number;
  color: string;
  faint?: boolean;
}) {
  const W = width;
  const H = height;
  const pts = 24;
  const top = H - 8 - (corpus / max) * (H - 16);
  const path = Array.from({ length: pts + 1 }, (_, i) => {
    const x = (i / pts) * W;
    const k = Math.pow(i / pts, 2.1);
    const y = H - 8 - k * (H - 8 - top);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Path d={`${path} L${W},${H} L0,${H} Z`} fill={color} opacity={faint ? 0.08 : 0.14} />
      <Path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={faint ? 1.5 : 2.5}
        strokeDasharray={faint ? "4 4" : undefined}
      />
    </Svg>
  );
}

export function Pill({
  children,
  color,
  testID,
}: {
  children: React.ReactNode;
  color: string;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      style={{
        backgroundColor: color + "1F",
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: "700", color }}>{children}</Text>
    </View>
  );
}

export function Btn({
  children,
  onPress,
  kind = "dark",
  theme,
  testID,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  kind?: "dark" | "gold" | "ghost";
  theme: Theme;
  testID?: string;
}) {
  const bg = kind === "dark" ? theme.ink : kind === "gold" ? theme.gold : theme.surface;
  const fg = kind === "ghost" ? theme.ink : "#fff";
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Text style={{ color: fg, fontSize: 14, fontWeight: "700" }}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Tiny inline icons rendered via SVG.
export function Icon({ name, color, size = 18 }: { name: string; color: string; size?: number }) {
  const common = {
    fill: "none" as const,
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      {name === "sip" && (
        <G {...common}>
          <Path d="M3 17l5-5 4 3 6-7" />
          <Path d="M14 8h5v5" />
        </G>
      )}
      {name === "tax" && (
        <G {...common}>
          <Path d="M4 3h14v18H4z" />
          <Path d="M8 8h6M8 12h6M8 16h3" />
        </G>
      )}
      {name === "goal" && (
        <G {...common}>
          <Circle cx={11} cy={11} r={8} />
          <Circle cx={11} cy={11} r={3} />
        </G>
      )}
      {name === "warn" && (
        <G {...common}>
          <Path d="M11 3l9 16H2z" />
          <Path d="M11 9v4M11 16v.5" />
        </G>
      )}
      {name === "up" && (
        <G {...common}>
          <Path d="M4 16l5-5 3 3 7-8" />
          <Path d="M14 6h5v5" />
        </G>
      )}
    </Svg>
  );
}

export function Header({
  title,
  onBack,
  theme,
}: {
  title: string;
  onBack: () => void;
  theme: Theme;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <Pressable
        onPress={onBack}
        testID="screen-back-button"
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.line,
          backgroundColor: theme.card,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: theme.ink, marginTop: -2 }}>←</Text>
      </Pressable>
      <Text style={{ fontSize: 17, fontWeight: "700", color: theme.ink }}>{title}</Text>
    </View>
  );
}

// Brand logo (nw mark + wordmark).
export function NWLogo({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <G stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <Path d="M8 12 H56" />
        <Path d="M14 12 V44 C14 50 18 54 24 54 C28 54 30 52 32 48 V18" />
        <Path d="M32 18 V46 C32 52 36 56 42 54 C46 53 48 50 50 46 V18" />
      </G>
    </Svg>
  );
}
