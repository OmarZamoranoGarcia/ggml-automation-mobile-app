import { Colors } from "@/constants/theme";
import { ApiError } from "@/services/api-client";
import { getEmailFiles } from "@/services/emails.service";
import { Email, EmailFile } from "@/types/email";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FilePreview from "./FilePreview";

interface EmailFilesModalProps {
  email: Email | null;
}

export default function EmailFilesModal({ email }: EmailFilesModalProps) {
  const [files, setFiles] = useState<EmailFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<EmailFile | null>(null);

  useEffect(() => {
    if (!email?.id) {
      setFiles([]);
      setSelectedFile(null);
      return;
    }

    let isMounted = true;

    async function loadFiles(emailId: string) {
      try {
        setLoading(true);
        setError(null);
        setSelectedFile(null);

        const filesWithUrls = await getEmailFiles(emailId);

        if (isMounted) {
          setFiles(filesWithUrls);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError("Error al cargar archivos");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFiles(email.id);

    return () => {
      isMounted = false;
    };
  }, [email?.id]);

  const handleFileClick = (file: EmailFile) => {
    setSelectedFile(file);
  };

  const getBadgeStyle = (role: string) => {
    switch (role) {
      case "ORIGINAL":
      case "COMPLETED":
        return styles.statusCompleted;

      case "SORT":
        return styles.statusSort;

      case "ERROR":
        return styles.statusError;

      case "OTHER":
        return styles.statusOther;

      default:
        return styles.statusDefault;
    }
  };

  if (!email) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>Sin email seleccionado</Text>
        <Text style={styles.text}>
          Selecciona un email para ver sus archivos adjuntos.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator
    >
      <View style={styles.filesSection}>
        <Text style={styles.title}>Archivos adjuntos</Text>

        <Text style={styles.fileCount}>
          {files.length} archivos encontrados
        </Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.text}>Cargando archivos...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {!loading && !error && files.length === 0 && (
          <View style={styles.noFiles}>
            <Text style={styles.text}>No hay archivos adjuntos</Text>
          </View>
        )}

        {!loading &&
          !error &&
          files.map((file) => (
            <Pressable
              key={file.id}
              onPress={() => handleFileClick(file)}
              style={[
                styles.fileCard,
                selectedFile?.id === file.id && styles.fileCardSelected,
              ]}
            >
              <View style={styles.fileIcon}>
                <Text style={styles.fileIconText}>📄</Text>
              </View>

              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.file_name}
                </Text>

                <Text style={styles.fileType} numberOfLines={1}>
                  {file.file_type || "Tipo desconocido"}
                </Text>

                <Text style={[styles.status, getBadgeStyle(file.file_role)]}>
                  {file.file_role || "Sin rol"}
                </Text>
              </View>
            </Pressable>
          ))}

        {selectedFile && (
          <View style={styles.previewContainer}>
            <FilePreview
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: 16, paddingBottom: 20 },
  emailDetails: {
    gap: 12,
    padding: 16,
    borderRadius: 10,
    backgroundColor: Colors.background.primary,
    borderWidth: 0.5,
    borderColor: Colors.background.button,
  },
  section: { gap: 4 },
  title: { fontSize: 12, fontWeight: "bold", color: Colors.text.secondary },
  text: { color: Colors.text.primary, fontSize: 14 },
  bodyContainer: {
    maxHeight: 220,
    overflow: "hidden",
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 10,
  },
  filesSection: { gap: 8 },
  fileCount: { fontSize: 12, color: Colors.text.secondary },
  fileCard: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.background.button,
    backgroundColor: Colors.background.primary,
  },
  fileCardSelected: { borderColor: Colors.background.button },
  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.secondary,
  },
  fileIconText: { fontSize: 16 },
  fileInfo: { flex: 1, gap: 3 },
  fileName: { color: Colors.text.primary, fontSize: 14, fontWeight: "600" },
  fileType: { color: Colors.text.secondary, fontSize: 12 },
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: Colors.text.primary,
    overflow: "hidden",
  },
  statusCompleted: { backgroundColor: "green" },
  statusSort: { backgroundColor: "blue" },
  statusError: { backgroundColor: "red" },
  statusOther: { backgroundColor: Colors.background.secondary },
  statusDefault: { backgroundColor: Colors.background.button },
  loadingContainer: { padding: 20, alignItems: "center", gap: 10 },
  errorContainer: { padding: 12, borderRadius: 8, backgroundColor: "red" },
  errorText: { color: "white" },
  noFiles: {
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.background.button,
    borderRadius: 10,
  },
  previewContainer: {
    minHeight: 350,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.background.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
});
