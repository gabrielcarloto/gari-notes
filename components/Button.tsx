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
  disabled?: boolean;
}

export default function Button({
  onPress,
  children,
  secondary = false,
  style,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        secondary ? styles.secondary : styles.primary,
        disabled && styles.disabled,
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
  disabled: {
    backgroundColor: "#AAA",
    borderColor: "#AAA",
    color: "#FAFAFA",
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
