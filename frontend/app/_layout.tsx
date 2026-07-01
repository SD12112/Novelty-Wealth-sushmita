import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  LogBox,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";


// Disable logbox errors etc so that users can see the app
// and agent works as expected.
LogBox.ignoreAllLogs(true);

// Keep the native splash visible from cold start until icon fonts register.
SplashScreen.preventAutoHideAsync();

// Desktop device shell — when shared as a web link and viewed on a wide screen,
// the app sits inside a phone-shaped mockup. On real phones (narrow viewport
// or native) it stays fullscreen as a regular mobile app.
function DeviceShell({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const showFrame = Platform.OS === "web" && width > 520;

  if (!showFrame) {
    return <View style={{ flex: 1 }}>{children}</View>;
  }

  // Phone frame sized to fit the viewport with a comfortable margin.
  const frameH = Math.min(880, height - 48);
  const frameW = Math.min(420, frameH * 0.48);

  return (
    <View style={styles.stage}>
      <View
        style={[
          styles.frame,
          {
            width: frameW,
            height: frameH,
          },
        ]}
      >
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useIconFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <DeviceShell>
        <Stack screenOptions={{ headerShown: false }} />
      </DeviceShell>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: "#DDE2EA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // @ts-ignore web-only background gradient
    backgroundImage:
      Platform.OS === "web"
        ? "radial-gradient(circle at 30% 20%, #EEF2F7 0%, #DDE2EA 60%, #C9D0DC 100%)"
        : undefined,
  },
  frame: {
    backgroundColor: "#0E1726",
    borderRadius: 44,
    padding: 10,
    // @ts-ignore web-only shadow
    boxShadow:
      Platform.OS === "web"
        ? "0 30px 60px rgba(14,23,38,.35), 0 0 0 2px rgba(255,255,255,.05) inset"
        : undefined,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
  },
  notch: {
    position: "absolute",
    top: 16,
    left: "50%",
    marginLeft: -55,
    width: 110,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#000",
    zIndex: 10,
  },
  screen: {
    flex: 1,
    borderRadius: 34,
    overflow: "hidden",
    backgroundColor: "#F4F6F9",
  },
});
