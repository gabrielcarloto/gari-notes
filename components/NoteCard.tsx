import { StyleSheet, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { forwardRef } from "react";

interface Props {
  children?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default forwardRef(function NoteCard(
  { children, onPress, onLongPress }: Props,
  _ref,
) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() => {
        if (onLongPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onLongPress();
        }
      }}
      style={styles.card}
    >
      {children}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FAFAFA",
    borderColor: "#C6C6C6",
    borderWidth: 1,
    borderRadius: 8,
  },
});
