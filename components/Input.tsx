import { TextInput, View, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  secureTextEntry?: boolean;
}

export default function Input({
  onChange,
  label,
  value,
  secureTextEntry,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  label: {
    fontSize: 14,
  },
  input: {
    backgroundColor: "#FAFAFA",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#8C8C8C",
    borderRadius: 8,
  },
});
