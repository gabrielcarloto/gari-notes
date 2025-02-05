import { ActivityIndicator, View } from "react-native";
import Button from "./Button";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";

export default function AuthGuard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  if (user) {
    return children;
  }

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button onPress={() => router.navigate("/(tabs)/account")}>
          Entrar na conta
        </Button>
      )}
    </View>
  );
}
