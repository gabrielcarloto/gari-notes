import Button from "@/components/Button";
import ScreenContainer from "@/components/ScreenContainer";
import useAuth from "@/hooks/useAuth";
import AuthenticationScreen from "@/screens/Authentication";
import { Firebase } from "@/services/Firebase";
import { Text } from "react-native";

export default function AccountScreen() {
  const { user } = useAuth();

  return user ? (
    <ScreenContainer title="Conta">
      <Text>Nome: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Premium: {user.isPremium ? "Sim" : "Não"}</Text>
      <Button onPress={Firebase.signOut}>Sair da conta</Button>
    </ScreenContainer>
  ) : (
    <AuthenticationScreen />
  );
}
