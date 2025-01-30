import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  onPress?: () => void;
  children?: string;
  secondary?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export default function Button({
  onPress,
  children,
  secondary = false,
  style,
  textStyle,
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
      <Text
        style={[
          secondary ? styles.textOnSecondary : styles.textOnPrimary,
          textStyle,
        ]}
      >
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
    height: 35,
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
