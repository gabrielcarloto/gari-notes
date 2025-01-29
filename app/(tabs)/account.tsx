import ScreenContainer from "@/components/ScreenContainer";
import useAuth from "@/hooks/useAuth";
import AuthenticationScreen from "@/screens/Authentication";
import { Text } from "react-native";

export default function AccountScreen() {
  const { user } = useAuth();

  return user ? (
    <ScreenContainer title="Conta">
      <Text>Nome: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Premium: {user.isPremium ? "Sim" : "Não"}</Text>
    </ScreenContainer>
  ) : (
    <AuthenticationScreen />
  );
}
