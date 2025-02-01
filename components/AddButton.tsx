import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function AddButton({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {isExpanded && children}
      <TouchableOpacity
        style={[styles.button, isExpanded && { backgroundColor: "#4A4A4A" }]}
        onPress={() => setIsExpanded((prev) => !prev)}
      >
        <MaterialIcons name="add" color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
}

export function AddButtonOption({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  button: {
    position: "relative",
    backgroundColor: "#242424",
    borderRadius: 100,
    aspectRatio: 1,
    width: 62,
    alignItems: "center",
    justifyContent: "center",
  },

  optionButton: {
    backgroundColor: "#363636",
    borderRadius: 4,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    color: "#DADADA",
    fontSize: 14,
  },
});
