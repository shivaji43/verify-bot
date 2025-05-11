import { getAmountByUser, getVaultByUser } from "@//actions/vault";
import { auth } from "@//auth";
import { WithdrawContent } from "./components/withdraw-content";
import { signIn } from "@//auth"; // Add this import for the sign-in function

export default async function VaultPage() {
  const session = await auth();
  
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <h1 className="text-2xl font-bold mb-4">
          Sign in with Discord to access your vault
        </h1>
        <form
          action={async () => {
            "use server";
            await signIn("discord");
          }}
        >
        </form>
      </main>
    );
  }

  const userDiscordId = session.user?.id || "";
  const vault = await getVaultByUser(userDiscordId);
  const amount = await getAmountByUser(userDiscordId);

  if (!vault || amount === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <h1 className="text-2xl font-bold mb-4">
          No Vault created for @{session?.user?.name}
        </h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <WithdrawContent
        assetSymbol={vault.asset.symbol}
        vaultId={vault.id}
        withdrawAmount={amount || 0}
      />
    </main>
  );
}