import { Text, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  children?: React.ReactNode;
  onPress?: () => void;
}

export default function NoteCard({ children, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {children}
    </TouchableOpacity>
  );
}

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
