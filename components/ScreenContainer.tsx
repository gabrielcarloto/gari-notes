import { StyleSheet, Text, View } from "react-native";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export default function ScreenContainer({ title, children }: Props) {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 32,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
});
