import { Colors } from "@/constants/theme";
import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  const isPrevDisabled = disabled || currentPage === 1;
  const isNextDisabled = disabled || currentPage === totalPages;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onPageChange(currentPage - 1)}
        disabled={isPrevDisabled}
        style={[styles.navButton, isPrevDisabled && styles.disabled]}
      >
        <Icon
          source="chevron-left"
          size={20}
          color={isPrevDisabled ? Colors.text.secondary : Colors.text.primary}
        />
      </Pressable>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <Text key={`dots-${index}`} style={styles.dots}>
            …
          </Text>
        ) : (
          <Pressable
            key={page}
            onPress={() => onPageChange(page)}
            disabled={disabled || page === currentPage}
            style={[
              styles.pageButton,
              page === currentPage && styles.pageButtonActive,
              disabled && page !== currentPage && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.pageText,
                page === currentPage && styles.pageTextActive,
              ]}
            >
              {page}
            </Text>
          </Pressable>
        ),
      )}

      <Pressable
        onPress={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        style={[styles.navButton, isNextDisabled && styles.disabled]}
      >
        <Icon
          source="chevron-right"
          size={20}
          color={isNextDisabled ? Colors.text.secondary : Colors.text.primary}
        />
      </Pressable>
    </View>
  );
}

export default memo(PaginationComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.input,
  },
  disabled: {
    opacity: 0.4,
  },
  pageButton: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.input,
  },
  pageButtonActive: {
    backgroundColor: Colors.background.button,
  },
  pageText: {
    color: Colors.text.secondary,
    fontWeight: "600",
    fontSize: 13,
  },
  pageTextActive: {
    color: Colors.text.primary,
  },
  dots: {
    color: Colors.text.secondary,
    paddingHorizontal: 4,
  },
});
