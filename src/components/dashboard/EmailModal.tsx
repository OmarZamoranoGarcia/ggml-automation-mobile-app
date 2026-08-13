import { Colors } from "@/constants/theme";
import type { Email } from "@/types/email";
import { FormatDateTime } from "@/utilities/FormatDateTime";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import FilesViewer from "./FilesViewer";

interface EmailModalProps {
  email: Email | null;
  visible: boolean;
  onClose: () => void;
}

export default function EmailModal({
  email,
  visible,
  onClose,
}: EmailModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView
            contentContainerStyle={styles.emailDetails}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>Detalles de Email</Text>
              <Pressable onPress={onClose}>
                <Icon
                  source="close-circle"
                  size={30}
                  color={Colors.background.button}
                />
              </Pressable>
            </View>

            <View style={styles.emailDetails}>
              <View style={styles.emailDetailSection}>
                <Text style={styles.title}>FECHA</Text>
                <Text style={styles.text}>
                  {FormatDateTime(email?.arrival_at!)}
                </Text>
              </View>

              <View>
                <Text style={styles.title}>CORREO</Text>
                <Text style={styles.text}>{email?.arrival_email}</Text>
              </View>

              <View>
                <Text style={styles.title}>ASUNTO</Text>
                <Text style={styles.text}>{email?.subject}</Text>
              </View>

              <View>
                <Text style={styles.title}>CUERPO</Text>
                <ScrollView
                  style={styles.body}
                  showsVerticalScrollIndicator={true}
                >
                  <Text style={styles.text}>{email?.body}</Text>
                </ScrollView>
              </View>

              <View>
                <Text style={styles.title}>STATUS</Text>
                <Text
                  style={[
                    styles.text,
                    styles.status,
                    email?.status === "COMPLETED"
                      ? styles.statusCompleted
                      : styles.statusOther,
                  ]}
                >
                  {email?.status}
                </Text>
              </View>
            </View>
            <Text style={styles.mainTitle}>Archivos adjuntos</Text>
            <FilesViewer email={email} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "90%",
    height: "90%",
    backgroundColor: Colors.background.secondary,
    borderRadius: 10,
    borderColor: Colors.background.button,
    borderWidth: 1,
    padding: 20,
    display: "flex",
    gap: 10,
  },
  mainSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 22,
    color: Colors.text.primary,
    fontWeight: "bold",
  },
  emailDetails: {
    gap: 10,
  },
  emailDetailSection: {
    gap: 5,
  },
  title: {
    color: Colors.text.secondary,
    fontWeight: "bold",
  },
  text: {
    color: Colors.text.primary,
  },
  body: {
    maxHeight: 200,
    borderColor: Colors.background.button,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
    marginTop: 5,
  },
  status: {
    padding: 5,
    alignSelf: "flex-start",
    borderRadius: 5,
    marginTop: 4,
  },

  statusCompleted: {
    backgroundColor: "green",
  },

  statusOther: {
    backgroundColor: "red",
  },
});
