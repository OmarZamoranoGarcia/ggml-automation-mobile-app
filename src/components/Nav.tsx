import { useAuth } from "@/hooks/auth.context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";
import { Colors } from "../constants/theme";

export default function Nav() {
  const { logout } = useAuth();
  const router = useRouter();
  const [logged, setLogged] = useState(true);

  const handleLogout = () => {
    setLogged(false);

    setTimeout(async () => {
      await logout();
    }, 2000);
  };

  return logged ? (
    <View style={styles.nav}>
      <Text style={[styles.iconText]}>
        <Icon source="inbox" size={25} color={Colors.background.input} /> Inbox
      </Text>
      <Text style={styles.text}>GGML Automation</Text>
      <Pressable onPress={handleLogout}>
        <Text style={[styles.iconText2]}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.logoutNav}>
      <Text style={styles.logoutText}>Cerrando sesión</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: Colors.background.primary,
  },
  text: {
    color: Colors.text.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  iconText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.background.button,
    color: Colors.background.input,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  iconText2: {
    borderRadius: 5,
    backgroundColor: Colors.background.button,
    color: Colors.background.input,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logoutNav: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    backgroundColor: Colors.background.primary,
  },
  logoutText: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.text.primary,
  },
});
