import { Colors } from "@/constants/theme";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface EmailFile {
  id: string;
  file_name: string;
  file_type: string;
  file_role: string;
  public_url?: string;
}

interface FilePreviewProps {
  file: EmailFile;
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const isImage = file.file_type?.startsWith("image/");

  const isPdf = file.file_type === "application/pdf";

  const isExcel =
    file.file_type?.includes("spreadsheet") ||
    file.file_type?.includes("excel") ||
    /\.(xlsx|xls|csv)$/i.test(file.file_name || "");

  const handleOpenFile = () => {
    if (file.public_url) {
      Linking.openURL(file.public_url);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.file_name}
          </Text>

          <Text style={styles.fileType} numberOfLines={1}>
            {file.file_type || "Tipo desconocido"}
          </Text>
        </View>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>

      {/* Preview */}
      <View style={styles.preview}>
        {/* Imagen */}
        {isImage && file.public_url && (
          <Image
            source={{
              uri: file.public_url,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* PDF */}
        {isPdf && (
          <View style={styles.unsupported}>
            <Text style={styles.icon}>📄</Text>

            <Text style={styles.title}>Archivo PDF</Text>

            <Text style={styles.description}>
              La vista previa del PDF no está disponible todavía.
            </Text>

            <Pressable style={styles.openButton} onPress={handleOpenFile}>
              <Text style={styles.buttonText}>Abrir PDF</Text>
            </Pressable>
          </View>
        )}

        {/* Excel */}
        {isExcel && (
          <View style={styles.unsupported}>
            <Text style={styles.icon}>📊</Text>

            <Text style={styles.title}>Archivo Excel</Text>

            <Text style={styles.description}>
              La vista previa de Excel se agregará posteriormente.
            </Text>

            <Pressable style={styles.openButton} onPress={handleOpenFile}>
              <Text style={styles.buttonText}>Abrir archivo</Text>
            </Pressable>
          </View>
        )}

        {/* Otros archivos */}
        {!isImage && !isPdf && !isExcel && (
          <View style={styles.unsupported}>
            <Text style={styles.icon}>📎</Text>

            <Text style={styles.title}>Vista previa no disponible</Text>

            <Text style={styles.description} numberOfLines={2}>
              {file.file_name}
            </Text>

            <Text style={styles.description}>
              {file.file_type || "Tipo desconocido"}
            </Text>

            <Pressable style={styles.openButton} onPress={handleOpenFile}>
              <Text style={styles.buttonText}>Abrir archivo</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    backgroundColor: Colors.background.secondary,
    borderRadius: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },

  fileInfo: {
    flex: 1,
  },

  fileName: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  fileType: {
    marginTop: 3,
    color: Colors.text.secondary,
    fontSize: 12,
  },

  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: Colors.background.button,
  },

  closeText: {
    color: Colors.text.primary,
    fontSize: 24,
    lineHeight: 26,
  },

  preview: {
    flex: 1,
    minHeight: 250,
    margin: 12,
    marginTop: 0,
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.background.button,
    backgroundColor: Colors.background.primary,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  unsupported: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  icon: {
    fontSize: 42,
    marginBottom: 10,
  },

  title: {
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  description: {
    marginTop: 6,
    color: Colors.text.secondary,
    fontSize: 13,
    textAlign: "center",
  },

  openButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.background.button,
  },

  buttonText: {
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: "600",
  },
});
