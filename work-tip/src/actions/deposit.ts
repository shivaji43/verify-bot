"use server";

import { makeXcrow } from "@/lib/xcrow";
import { DepositInput, DepositOutput } from "@xcrowdev/node";

export const deposit = async (
  params: DepositInput
): Promise<DepositOutput> => {
  const xcrow = await makeXcrow()
  const response = await xcrow.deposit(params);

  return response;
};
