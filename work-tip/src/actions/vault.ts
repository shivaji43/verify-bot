"use server";

import { makeSupabase } from "@/lib/supabase";
import { makeXcrow } from "@/lib/xcrow";
import { CreateVaultOutput } from "@xcrowdev/node";
import { revalidatePath } from "next/cache";

export const createVault = async ({
  payer,
}: {
  payer: string;
}): Promise<CreateVaultOutput> => {
  const xcrow = await makeXcrow();
  const response = await xcrow.createVault({
    network: "mainnet",
    payer,
    strategy: "blockhash",
    token: {
      mintAddress: process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || "",
    },
  });

  return response;
};

export async function saveVault({
  userDiscordId,
  vaultId,
}: {
  userDiscordId: string;
  vaultId: string;
}) {
  const supabase = await makeSupabase();
  const { data, error } = await supabase
    .from("vaults")
    .select("vault_id")
    .eq("discord_user_id", userDiscordId)
    .maybeSingle();

  if (error) {
    throw new Error(`Error checking vault: ${error.message}`);
  }

  // user does not exists
  if (!data) {
    const { error: insertError } = await supabase.from("vaults").insert([
      {
        discord_user_id: userDiscordId,
        vault_id: vaultId,
      },
    ]);

    if (insertError) {
      throw new Error(`Error creating vault: ${insertError.message}`);
    }

    revalidatePath('/')
    return;
  }

  // user exists - but has no vault
  if (!data.vault_id) {
    const { error: updateError } = await supabase
      .from("vaults")
      .update({ vault_id: vaultId })
      .eq("discord_user_id", userDiscordId);

    if (updateError) {
      throw new Error(`Error updating vault: ${updateError.message}`);
    }

    revalidatePath('/')
    return;
  }

  revalidatePath('/')
  return;
}


export const getVaultByUser = async (userDiscordId: string) => {
  const xcrow = await makeXcrow();
  const supabase = await makeSupabase();

  const { data } = await supabase
    .from("vaults")
    .select("vault_id")
    .eq("discord_user_id", userDiscordId)
    .maybeSingle();

  if (!data) {
    return null
  }

  const response = await xcrow.getVaultDetails(data.vault_id);
  return response;
};

