import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenContainer from "@/components/ScreenContainer";
import useAuth from "@/hooks/useAuth";
import AuthenticationScreen from "@/screens/Authentication";
import { UserService } from "@/services/UserService";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function AccountScreen() {
  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const { user, refetch } = useAuth();

  useEffect(() => setUserName(user?.name ?? ""), [user?.name]);

  return user ? (
    <ScreenContainer title="Conta">
      {editing ? (
        <View style={styles.infosContainer}>
          <Input label="Nome" value={userName} onChange={setUserName} />
          <Button
            onPress={() =>
              UserService.updateUser({ name: userName }).then((res) => {
                if (!res) {
                  setUserName(user.name);
                  return Alert.alert(
                    "Erro!",
                    "Não foi possível atualizar suas informações",
                  );
                }

                refetch();
                setEditing(false);
              })
            }
          >
            Salvar
          </Button>
        </View>
      ) : (
        <View style={styles.infosContainer}>
          <UserInfo label="Nome" info={userName} />
          <UserInfo label="E-mail" info={user.email} />
          <UserInfo
            label="Tipo de usuário"
            info={user.isPremium ? "PREMIUM" : "Pobrão"}
          />

          <View style={styles.buttonsContainer}>
            <Button
              secondary
              onPress={() => setEditing(true)}
              style={{ flex: 1 }}
            >
              Editar
            </Button>

            <Button
              onPress={() =>
                UserService.signOut().then(() => setEditing(false))
              }
              style={{ flex: 1 }}
            >
              Sair
            </Button>
          </View>

          {!user.isPremium && (
            <Button
              onPress={() =>
                UserService.updateUser({ isPremium: true }).then(refetch)
              }
              style={styles.premiumButton}
              textStyle={styles.premiumButtonText}
            >
              VIRAR PREMIUM
            </Button>
          )}
        </View>
      )}
    </ScreenContainer>
  ) : (
    <AuthenticationScreen />
  );
}

const styles = StyleSheet.create({
  infosContainer: {
    gap: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  premiumButton: {
    backgroundColor: "#24E1AC",
  },
  premiumButtonText: {
    color: "#003F21",
  },
});

interface UserInfoProps {
  label: string;
  info: string;
}

function UserInfo({ label, info }: UserInfoProps) {
  return (
    <View style={userInfoStyles.wrapper}>
      <Text style={userInfoStyles.label}>{label}</Text>
      <Text>{info}</Text>
    </View>
  );
}

const userInfoStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#4A4A4A",
  },
});
