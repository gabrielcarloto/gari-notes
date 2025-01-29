import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenContainer from "@/components/ScreenContainer";
import { Firebase } from "@/services/Firebase";
import { useState } from "react";

export default function AccountScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  async function create() {
    const res = await Firebase.signUp(user, password);

    if (!res) return setAuthenticated(false);

    console.log("Usuário criado!!!");
    console.log(res);
    setAuthenticated(true);
  }

  async function login() {
    const res = await Firebase.signIn(user, password);

    if (!res) return setAuthenticated(false);

    console.log("Usuário logado!!!");
    console.log(res);
    setAuthenticated(true);
  }

  return (
    <ScreenContainer title={authenticated ? "Conta" : "Login"}>
      <Input onChange={setUser} label="Usuário" />
      <Input onChange={setPassword} label="Senha" />
      <Button onPress={create}>Criar conta</Button>
      <Button onPress={login} secondary>
        Logar
      </Button>
    </ScreenContainer>
  );
}
