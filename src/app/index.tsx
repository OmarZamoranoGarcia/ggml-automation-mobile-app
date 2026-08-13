// https://oss.callstack.com/react-native-paper/docs/guides/icons
// https://pictogrammers.com/library/mdi/icon/inbox-arrow-down/
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/theme";
import { useAuth } from "../hooks/auth.context";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // espera a que AuthProvider termine de leer AsyncStorage

    const timer = setTimeout(() => {
      router.replace(isAuthenticated ? "/dashboard" : "/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>GGML Automation</Text>
        <Text style={styles.appSubtitle}>Bienvenida Miriam</Text>
      </View>
      <ActivityIndicator
        size="large"
        color={Colors.background.button}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.primary,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  loader: {
    marginTop: 20,
  },
});
