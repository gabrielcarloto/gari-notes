import AuthGuard from "@/components/AuthGuard";
import ScreenContainer from "@/components/ScreenContainer";

function TasksScreen() {
  return <></>;
}

export default function Screen() {
  return (
    <ScreenContainer title="Tarefas">
      <AuthGuard>
        <TasksScreen />
      </AuthGuard>
    </ScreenContainer>
  );
}
