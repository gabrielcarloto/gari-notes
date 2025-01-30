import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  onPress?: () => void;
  children?: string;
  secondary?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  onPress,
  children,
  secondary = false,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        secondary ? styles.secondary : styles.primary,
        style,
      ]}
    >
      <Text style={secondary ? styles.textOnSecondary : styles.textOnPrimary}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#363636",
  },
  secondary: {
    borderColor: "#363636",
    borderWidth: 1,
    borderStyle: "solid",
  },

  textOnPrimary: {
    fontSize: 13,
    color: "#DADADA",
  },
  textOnSecondary: {
    fontSize: 13,
    color: "#363636",
  },
});
