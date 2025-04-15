'use server'

import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js'

export const getSerializedTransaction = async (
  fromPubkey: string,
  amount: number,
) => {
  const receiverWallet = process.env.RECEIVER_WALLET
  const usdcMintAddress = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS
  const rpcUrl = process.env.RPC_URL || ''

  if (!receiverWallet || !usdcMintAddress) {
    throw new Error('Receiver wallet or USDC mint not configured')
  }

  const connection = new Connection(rpcUrl)
  const from = new PublicKey(fromPubkey)
  const to = new PublicKey(receiverWallet)
  const mint = new PublicKey(usdcMintAddress)

  const fromTokenAccount = await getAssociatedTokenAddress(mint, from)
  const toTokenAccount = await getAssociatedTokenAddress(mint, to)
  
  const transaction = new Transaction()

  try {
    await getAccount(connection, toTokenAccount)
  } catch (e) {
    const createATAIx = createAssociatedTokenAccountInstruction(
      from, // payer
      toTokenAccount,
      to,
      mint
    )
    transaction.add(createATAIx)
  }

  const decimals = 6
  const amountInUnits = amount * 10 ** decimals;

  const transferIx = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    from,
    amountInUnits,
    [],
    TOKEN_PROGRAM_ID,
  )

  transaction.add(transferIx)
  
  transaction.feePayer = from
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  
  return {
    serializedTransaction: transaction
      .serialize({ requireAllSignatures: false })
      .toString('base64'),
  }
}
