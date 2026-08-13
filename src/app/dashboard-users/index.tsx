import Nav from "@/components/Nav";
import { Colors } from "@/constants/theme";
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function Dashboard() {
  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          backgroundColor: Colors.background.secondary,
          gap: 10,
        }}
      >
        <Nav />
        <Text style={{ color: "white", marginLeft: 15 }}>
          Dashboard Users para usuarios que no sean admin
        </Text>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    gap: 10,
    backgroundColor: Colors.background.secondary,
  },
  listContent: {
    paddingHorizontal: 10,
    gap: 10,
    paddingBottom: 10,
  },
});
