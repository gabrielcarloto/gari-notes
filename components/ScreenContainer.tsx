import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface Props {
  title?: string;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({
  title,
  children,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
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
    paddingBottom: 0,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
});
