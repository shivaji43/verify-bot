import { getVaultByUser } from "@/actions/vault";
import { auth } from "@/auth";
import { WithdrawFromVault } from "./components/withdraw";

export default async function VaultPage() {
  const session = await auth();
  const userDiscordId = session?.user?.id || "";
  const vault = await getVaultByUser(userDiscordId);

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <h1 className="text-2xl font-bold mb-4">
          Sign in with Discord to access your vault
        </h1>
      </main>
    );
  }

  if (!vault) {
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
      <div className="flex flex-col p-4 bg-zinc-900 rounded-lg">
        {/* Header */}
        <div className="flex gap-1 text-xl font-semibold">
          <div className="flex gap-2 items-center">
            <img src={vault?.asset.logoUri} className="size-5" />
            <span>{vault?.asset.symbol}</span>
          </div>
          <p>Vault</p>
        </div>

        {/* Content */}
        <div className="mt-4 font-medium">
          <div className="flex gap-2">
            Withdraw Amount:{" "}
            <div className="flex gap-2 items-center">
              <span className="underline font-bold">
                {vault?.asset.amountParsed} {vault?.asset.symbol}
              </span>
            </div>
          </div>
          <WithdrawFromVault
            amount={vault.asset.amountParsed}
            vaultId={vault.id}
          />
        </div>
      </div>
    </main>
  );
}
