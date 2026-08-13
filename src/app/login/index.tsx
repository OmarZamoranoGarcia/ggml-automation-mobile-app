import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/auth.context";
import { ApiError } from "@/services/api-client";
import { login } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function Login() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!loginForm.email || !loginForm.password) {
      setErrorMessage("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const user = await login(loginForm.email, loginForm.password);
      setSession(user);

      // Redirige según el rol, igual como lo planteamos en el backend
      if (user.role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/dashboard-users");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // Mensaje que ya viene formateado desde tu AuthService de Nest
        // (ej. "Credenciales inválidas", "Cuenta inactiva...")
        setErrorMessage(error.message);
      } else {
        setErrorMessage("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar sesión</Text>
          <Text style={styles.formSubtitle}>
            Ingresa tus credenciales para continuar.
          </Text>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.emailView}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, isFocused && styles.inputFocused]}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="tucorreo@ejemplo.com"
              value={loginForm.email}
              onChangeText={(formValue) =>
                setLoginForm({ ...loginForm, email: formValue })
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          <View style={styles.passwordView}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={[styles.input, isFocused && styles.inputFocused]}
              secureTextEntry
              placeholder="********"
              value={loginForm.password}
              onChangeText={(formValue) =>
                setLoginForm({ ...loginForm, password: formValue })
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.loginButton,
              { opacity: pressed || loading ? 0.5 : 1 },
            ]}
          >
            <Text style={styles.textLoginButton}>
              {loading ? "Verificando..." : "Ingresar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: 20,
    backgroundColor: Colors.background.secondary,
    borderRadius: 10,
    width: "100%",
    height: "auto",
    color: "white",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  formSubtitle: {
    color: "white",
  },
  emailView: {
    paddingVertical: 15,
  },
  passwordView: {
    paddingVertical: 15,
  },
  inputLabel: {
    color: Colors.text.secondary,
    paddingBottom: 5,
  },
  input: {
    backgroundColor: Colors.background.input,
    padding: 10,
    borderRadius: 5,
    color: Colors.text.secondary,
  },
  inputFocused: {
    borderColor: Colors.border.focused,
    borderWidth: 1,
  },
  loginButton: {
    width: "100%",
    padding: 12,
    backgroundColor: Colors.background.button,
    borderRadius: 10,
  },
  textLoginButton: {
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "rgba(220, 38, 38, 0.15)", // rojo translúcido sobre el fondo oscuro
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.4)",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  errorText: {
    color: "#f87171", // rojo claro, legible sobre fondo oscuro
    textAlign: "center",
    fontWeight: "500",
  },
});
