import { Colors } from "@/constants/theme";
import { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Icon } from "react-native-paper";

interface LogEntry {
  level: "Error" | "Warning" | "Info";
  message: string;
}

interface EmailResult {
  emailId?: string;
  subject?: string;
  from?: string;
  status?: "COMPLETED" | "SKIPPED" | "NOT_PROCESSED" | "ERROR";
  errorMessage?: string;
  note?: string;
}

interface EmailCheckResult {
  success: boolean;
  totalEmailsFound: number;
  processed: number;
  skipped: number;
  notProcessed: number;
  errors: number;
  emails: EmailResult[];
  logs: LogEntry[];
}

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: unknown;
  error?: string | null;
}

const LEVEL_STYLES: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Error: {
    bg: "rgba(220, 38, 38, 0.1)",
    border: "rgba(220, 38, 38, 0.3)",
    text: "#f87171",
  },
  Warning: {
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#fbbf24",
  },
  Info: {
    bg: Colors.background.input,
    border: Colors.background.button,
    text: Colors.text.secondary,
  },
};

const STATUS_STYLES: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  COMPLETED: {
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#34d399",
  },
  SKIPPED: {
    bg: Colors.background.input,
    border: Colors.background.button,
    text: Colors.text.secondary,
  },
  NOT_PROCESSED: {
    bg: "rgba(14, 165, 233, 0.1)",
    border: "rgba(14, 165, 233, 0.3)",
    text: "#38bdf8",
  },
  ERROR: {
    bg: "rgba(220, 38, 38, 0.1)",
    border: "rgba(220, 38, 38, 0.3)",
    text: "#f87171",
  },
};

function Badge({
  text,
  palette,
}: {
  text: string;
  palette: { bg: string; border: string; text: string };
}) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette.bg, borderColor: palette.border },
      ]}
    >
      <Text style={[styles.badgeText, { color: palette.text }]}>{text}</Text>
    </View>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, accent ? { color: accent } : undefined]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function isStructuredResult(data: unknown): data is EmailCheckResult {
  return (
    !!data &&
    typeof data === "object" &&
    Array.isArray((data as EmailCheckResult).logs) &&
    Array.isArray((data as EmailCheckResult).emails)
  );
}

export function ApiModal({ isOpen, onClose, data, error }: ApiModalProps) {
  const [showLogs, setShowLogs] = useState(true);

  const structured = !error && isStructuredResult(data);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={styles.centeredWrapper} pointerEvents="box-none">
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {error ? "Error en la solicitud" : "Revisión de correos"}
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Icon source="close" size={22} color={Colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} nestedScrollEnabled>
            {/* Caso: error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Caso: respuesta estructurada */}
            {structured && (
              <>
                <View style={styles.row}>
                  <Badge
                    text={
                      (data as EmailCheckResult).success
                        ? "Éxito"
                        : "Con errores"
                    }
                    palette={
                      (data as EmailCheckResult).success
                        ? STATUS_STYLES.COMPLETED
                        : STATUS_STYLES.ERROR
                    }
                  />
                  <Text style={styles.subtleText}>
                    {(data as EmailCheckResult).totalEmailsFound} correo(s)
                    encontrados
                  </Text>
                </View>

                <View style={styles.statsRow}>
                  <Stat
                    label="Procesados"
                    value={(data as EmailCheckResult).processed}
                    accent="#34d399"
                  />
                  <Stat
                    label="Omitidos"
                    value={(data as EmailCheckResult).skipped}
                  />
                  <Stat
                    label="No procesados"
                    value={(data as EmailCheckResult).notProcessed}
                    accent="#38bdf8"
                  />
                  <Stat
                    label="Errores"
                    value={(data as EmailCheckResult).errors}
                    accent={
                      (data as EmailCheckResult).errors > 0
                        ? "#f87171"
                        : undefined
                    }
                  />
                </View>

                {(data as EmailCheckResult).emails?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Correos</Text>
                    <View style={styles.listContainer}>
                      {(data as EmailCheckResult).emails.map((e, i) => (
                        <View
                          key={e.emailId || i}
                          style={[
                            styles.emailRow,
                            i !== 0 && styles.emailRowBorder,
                          ]}
                        >
                          <View style={styles.emailInfo}>
                            <Text style={styles.emailSubject} numberOfLines={1}>
                              {e.subject || "(sin asunto)"}
                            </Text>
                            <Text style={styles.emailFrom} numberOfLines={1}>
                              {e.from}
                            </Text>
                            {e.errorMessage && (
                              <Text style={styles.emailError}>
                                {e.errorMessage}
                              </Text>
                            )}
                            {e.note && !e.errorMessage && (
                              <Text style={styles.emailNote}>{e.note}</Text>
                            )}
                          </View>
                          <Badge
                            text={e.status ?? "SKIPPED"}
                            palette={
                              STATUS_STYLES[e.status ?? "SKIPPED"] ??
                              STATUS_STYLES.SKIPPED
                            }
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {(data as EmailCheckResult).logs?.length > 0 && (
                  <View style={styles.section}>
                    <Pressable
                      onPress={() => setShowLogs((v) => !v)}
                      style={styles.logsToggle}
                    >
                      <Text style={styles.sectionTitle}>
                        Logs ({(data as EmailCheckResult).logs.length})
                      </Text>
                      <Icon
                        source={showLogs ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={Colors.text.secondary}
                      />
                    </Pressable>

                    {showLogs && (
                      <ScrollView style={styles.logsList} nestedScrollEnabled>
                        {(data as EmailCheckResult).logs.map((log, i) => {
                          const palette =
                            LEVEL_STYLES[log.level] ?? LEVEL_STYLES.Info;
                          return (
                            <View
                              key={i}
                              style={[
                                styles.logRow,
                                i !== 0 && styles.logRowBorder,
                              ]}
                            >
                              <View
                                style={[
                                  styles.logBadge,
                                  {
                                    backgroundColor: palette.bg,
                                    borderColor: palette.border,
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.logBadgeText,
                                    { color: palette.text },
                                  ]}
                                >
                                  {log.level}
                                </Text>
                              </View>
                              <Text style={styles.logMessage}>
                                {log.message}
                              </Text>
                            </View>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>
                )}
              </>
            )}

            {/* Fallback: JSON crudo */}
            {!error && !structured && (
              <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>
                  {JSON.stringify(data, null, 2)}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 600,
    maxHeight: "85%",
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.background.input,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.input,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  body: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.3)",
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: "#f87171",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  subtleText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  statBox: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.input,
    borderWidth: 1,
    borderColor: Colors.background.input,
    minWidth: 70,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  listContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.background.input,
    overflow: "hidden",
  },
  emailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
  },
  emailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.background.input,
  },
  emailInfo: {
    flex: 1,
  },
  emailSubject: {
    fontWeight: "600",
    fontSize: 14,
    color: Colors.text.primary,
  },
  emailFrom: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  emailError: {
    fontSize: 12,
    color: "#f87171",
    marginTop: 4,
  },
  emailNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: "italic",
    marginTop: 4,
  },
  logsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logsList: {
    maxHeight: 220,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.background.input,
    marginTop: 4,
  },
  logRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
  },
  logRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.background.input,
  },
  logBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  logBadgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  logMessage: {
    flex: 1,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  fallbackContainer: {
    backgroundColor: Colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.background.input,
    padding: 12,
  },
  fallbackText: {
    fontSize: 12,
    color: Colors.text.primary,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.input,
    alignItems: "flex-end",
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.input,
  },
  closeButtonText: {
    color: Colors.text.secondary,
    fontWeight: "500",
  },
});
