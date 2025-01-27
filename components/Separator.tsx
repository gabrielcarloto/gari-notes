import { StyleSheet, View, Text } from "react-native";

interface Props {
  label?: string;
}

export default function Separator({ label }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 12,
    height: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#DADADA",
  },
  label: {
    fontWeight: 200,
    fontSize: 12,
  },
});
