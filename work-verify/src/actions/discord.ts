"use server";

import { DISCORD_API_URL } from "@/utils/config";
import { makeSupabase } from "@/lib/supabase";



export const sendDiscordTipAnnounce = async ({
  receiverId,
  senderId,
  amount,
  serverId,
}: {
  senderId: string;
  receiverId: string;
  amount: number;
  serverId: string | null;
}) => {
  const supabase = await makeSupabase()
  const { data, error } = await supabase
    .from("servers")
    .select("channel_id")
    .eq("server_id", serverId)
    .single();

  if (error || !data?.channel_id) {
    console.error("Failed to get announcement channel ID:", error);
    return;
  }

  await fetch(`${DISCORD_API_URL}/send-channel-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `<@${senderId}> just sent **${amount} USDC** to <@${receiverId}>!`,
      channelId: data.channel_id,
      guildId:serverId
    }),
  });
};

export const sendDiscordTipDirectMessage = async ({
  receiverId,
  senderId,
  amount,
  claimUrl,
  serverId,
}: {
  senderId: string;
  receiverId: string;
  amount: number;
  claimUrl: string;
  serverId:string | null;
}) => {
  const claimFinalUrl = `${claimUrl}/vault`;

  await fetch(`${DISCORD_API_URL}/send-direct-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: receiverId,
      message:
        `🎉 You just received **${amount} USDC** from <@${senderId}>!\n` +
        `👉 [Go to vault to claim it](${claimFinalUrl})`,
      guildId:serverId
    }),
  });
};
