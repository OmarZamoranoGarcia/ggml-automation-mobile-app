import { Colors } from "@/constants/theme";
import type { Email } from "@/types/email";
import { FormatDateTime } from "@/utilities/FormatDateTime";
import { Pressable, StyleSheet, Text } from "react-native";

interface EmailCardProps {
  email: Email;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function EmailCard({
  email,
  isSelected,
  onSelect,
}: EmailCardProps) {
  const handlePress = () => {
    onSelect?.(email.id);
  };

  return (
    <Pressable
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={handlePress}
    >
      <Text style={[styles.text, styles.arrival_at]}>
        {FormatDateTime(email.arrival_at)}
      </Text>

      <Text style={[styles.text, styles.arrival_email]}>
        {email.arrival_email}
      </Text>

      <Text style={[styles.text, styles.subject]}>{email.subject}</Text>

      <Text style={[styles.text, styles.body]} numberOfLines={2}>
        {email.body}
      </Text>

      <Text
        style={[
          styles.text,
          styles.status,
          email.status === "COMPLETED"
            ? styles.statusCompleted
            : styles.statusOther,
        ]}
      >
        {email.status}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.primary,
    padding: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.background.button,
    flex: 1,
    gap: 8,
  },

  cardSelected: {
    borderWidth: 1,
  },

  text: {
    color: Colors.text.primary,
  },

  arrival_at: {
    color: Colors.text.secondary,
  },

  arrival_email: {
    fontWeight: "bold",
    fontSize: 18,
  },

  subject: {},

  body: {
    color: Colors.text.secondary,
  },

  status: {
    padding: 5,
    alignSelf: "flex-start",
    borderRadius: 5,
  },

  statusCompleted: {
    backgroundColor: "green",
  },

  statusOther: {
    backgroundColor: "red",
  },
});
