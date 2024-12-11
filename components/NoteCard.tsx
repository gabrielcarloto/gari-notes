import { Text, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  children?: React.ReactNode;
  title: string;
  onPress?: () => void;
}

export default function NoteCard({ children, title, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.noteTitle}>{title}</Text>
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
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#363636",
    marginBottom: 8,
  },
});
