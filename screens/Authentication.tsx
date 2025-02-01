import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenContainer from "@/components/ScreenContainer";
import { UserService } from "@/services/UserService";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function AuthenticationScreen() {
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function createUser() {
    setLoading(true);
    const user = await UserService.signUp(
      userData.name,
      userData.email,
      userData.password,
    );

    if (!user) {
      Alert.alert("ERRO!", "Não foi possível criar o usuário");
    }
    setLoading(true);
  }

  async function login() {
    setLoading(true);
    const user = await UserService.signIn(userData.email, userData.password);

    if (!user) {
      Alert.alert("ERRO!", "Credenciais inválidas");
    }
    setLoading(false);
  }

  function toggleStep() {
    setStep((step) => (step === "signIn" ? "signUp" : "signIn"));
    setUserData({
      name: "",
      email: "",
      password: "",
    });
  }

  return (
    <ScreenContainer title={step === "signIn" ? "Login" : "Criar conta"}>
      <View style={styles.formContainer}>
        {step === "signUp" ? (
          <Input
            value={userData.name}
            onChange={(name) => setUserData((prev) => ({ ...prev, name }))}
            label="Nome"
          />
        ) : null}

        <Input
          value={userData.email}
          onChange={(email) => setUserData((prev) => ({ ...prev, email }))}
          label="Email"
        />

        <Input
          value={userData.password}
          onChange={(password) =>
            setUserData((prev) => ({ ...prev, password }))
          }
          label="Senha"
          secureTextEntry
        />

        <View style={styles.buttonsContainer}>
          <Button
            style={styles.button}
            disabled={loading}
            secondary
            onPress={toggleStep}
          >
            {step === "signIn" ? "Registrar" : "Fazer login"}
          </Button>
          <Button
            disabled={loading}
            style={styles.button}
            onPress={step === "signIn" ? login : createUser}
          >
            {step === "signIn" ? "Entrar" : "Registrar"}
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 8,
  },
  buttonsContainer: {
    gap: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    height: 40,
    width: 100,
  },
});
