// app/_layout.js
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { AuthProvider, useAuth } from "../hooks/auth.context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentSegment = segments[0] as string | undefined;

    const inLoginScreen = currentSegment === "login";
    const inIndexScreen = currentSegment === undefined;

    if (inIndexScreen) return;

    if (!isAuthenticated && !inLoginScreen) {
      router.replace("/login");
    } else if (isAuthenticated && inLoginScreen) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <PaperProvider>
          <StatusBar style="dark" />
          <SafeAreaView style={styles.container}>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#ffffff",
                },
                headerTintColor: "#000000",
                headerTitleStyle: {
                  fontWeight: "600",
                },
                headerShadowVisible: false,
                contentStyle: {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="login/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="dashboard/index"
                options={{ headerShown: false }}
              />
            </Stack>
          </SafeAreaView>
        </PaperProvider>
      </RouteGuard>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
