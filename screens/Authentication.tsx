import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenContainer from "@/components/ScreenContainer";
import { Firebase } from "@/services/Firebase";
import { useState } from "react";

const initialUserData = {
  name: "",
  email: "",
  password: "",
};

export default function AuthenticationScreen() {
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");

  const [userData, setUserData] = useState(initialUserData);

  async function createUser() {
    await Firebase.signUp(userData.name, userData.email, userData.password);
  }

  async function login() {
    await Firebase.signIn(userData.email, userData.password);
  }

  function toggleStep() {
    setStep((step) => (step === "signIn" ? "signUp" : "signIn"));
    setUserData(initialUserData);
  }

  return (
    <ScreenContainer title={step === "signIn" ? "Login" : "Criar conta"}>
      {step === "signUp" ? (
        <Input
          onChange={(name) => setUserData((prev) => ({ ...prev, name }))}
          label="Nome"
        />
      ) : null}

      <Input
        onChange={(email) => setUserData((prev) => ({ ...prev, email }))}
        label="Email"
      />

      <Input
        onChange={(password) => setUserData((prev) => ({ ...prev, password }))}
        label="Senha"
      />

      <Button secondary onPress={toggleStep}>
        {step === "signIn" ? "Criar conta" : "Login"}
      </Button>

      <Button onPress={step === "signIn" ? login : createUser}>
        {step === "signIn" ? "Logar" : "Criar conta"}
      </Button>
    </ScreenContainer>
  );
}
