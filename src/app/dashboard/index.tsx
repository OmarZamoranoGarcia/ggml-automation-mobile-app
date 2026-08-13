import { ApiModal } from "@/components/ApiModal";
import EmailCard from "@/components/dashboard/EmailCard";
import EmailModal from "@/components/dashboard/EmailModal";
import Nav from "@/components/Nav";
import Pagination from "@/components/Pagination";
import { Colors } from "@/constants/theme";
import {
  checkEmails,
  EmailCheckResult,
} from "@/services/ggml-automation.service";
import type { Email } from "@/types/email";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { ApiError } from "../../services/api-client";
import { getEmails } from "../../services/emails.service";

export default function Dashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openApiModal, setOpenApiModal] = useState(false);
  const [apiResponse, setApiResponse] = useState<EmailCheckResult | null>(null);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [loadingCheckEmailsApi, setLoadingCheckEmailsApi] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const latestRequestedPage = useRef(1);

  const loadEmails = useCallback(async (page: number) => {
    latestRequestedPage.current = page; // marca esta como la petición "vigente"
    setLoading(true);
    setError(null);

    try {
      const response = await getEmails(page);

      // si mientras esperábamos, se pidió otra página distinta, ignora esta respuesta
      if (latestRequestedPage.current !== page) return;

      setEmails(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      if (latestRequestedPage.current !== page) return;

      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo conectar con el servidor");
      }
    } finally {
      if (latestRequestedPage.current === page) {
        setLoading(false);
      }
    }
  }, []);

  const filteredEmails = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return emails;

    return emails.filter((email) => {
      const from = email.arrival_email?.toLowerCase() ?? "";
      return from.includes(query);
    });
  }, [emails, search]);

  useEffect(() => {
    loadEmails(currentPage);
  }, [currentPage, loadEmails]);

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    setModalVisible(true);
  };

  const handleCheckEmails = async () => {
    setLoadingCheckEmailsApi(true);
    setErrorApi(null);
    setApiResponse(null);

    try {
      const data = await checkEmails();
      setApiResponse(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorApi(err.message);
      } else {
        setErrorApi("No se pudo conectar con el servidor");
      }
    } finally {
      setLoadingCheckEmailsApi(false);
      setOpenApiModal(true);
      loadEmails(currentPage);
    }
  };

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
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholder="Buscar emails por correo..."
            placeholderTextColor="var(--text-secondary)" // O usa un color hex directo
          />
          <Pressable
            onPress={handleCheckEmails}
            disabled={loadingCheckEmailsApi}
            style={({ pressed }) => [
              styles.button,
              pressed && !loadingCheckEmailsApi && styles.buttonPressed,
              loadingCheckEmailsApi && styles.buttonLoading,
            ]}
          >
            {loadingCheckEmailsApi && (
              <ActivityIndicator color={Colors.text.button} size="small" />
            )}

            <Text style={[styles.buttonText]}>
              {loadingCheckEmailsApi
                ? "Revisando correos ..."
                : "Revisar correos"}
            </Text>
          </Pressable>
        </View>
        <Text style={{ color: "white", marginLeft: 15 }}>
          Correos encontrados: {filteredEmails.length}
        </Text>
        <FlatList
          data={filteredEmails}
          renderItem={({ item }) => (
            <EmailCard email={item} onSelect={() => handleSelectEmail(item)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          disabled={loading}
        />
        <EmailModal
          email={selectedEmail}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
        <ApiModal
          isOpen={openApiModal}
          onClose={() => setOpenApiModal(false)}
          data={apiResponse}
          error={errorApi}
        />
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
  header: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border.focused,
    backgroundColor: Colors.background.input,
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.background.button,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonPressed: {
    backgroundColor: Colors.background.button,
    opacity: 0.8,
  },
  buttonLoading: {
    backgroundColor: Colors.background.button,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.text.button, // #ffffff
    fontWeight: "600",
    fontSize: 16,
  },
});
