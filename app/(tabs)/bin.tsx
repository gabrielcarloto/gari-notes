import AuthGuard from "@/components/AuthGuard";
import ScreenContainer from "@/components/ScreenContainer";

export default function TrashBinScreen() {
  return (
    <ScreenContainer title="Lixeira">
      <AuthGuard></AuthGuard>
    </ScreenContainer>
  );
}
