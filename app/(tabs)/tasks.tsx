import AuthGuard from "@/components/AuthGuard";
import ScreenContainer from "@/components/ScreenContainer";

export default function TasksScreen() {
  return (
    <ScreenContainer title="Tarefas">
      <AuthGuard></AuthGuard>
    </ScreenContainer>
  );
}
