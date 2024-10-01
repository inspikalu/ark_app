import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  AnchorProvider,
  Program,
  utils,
  Wallet,
  BN,
  Idl,
  AnchorError,
} from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useMemo } from 'react';
import { CustomWallet } from '../../components/new/CustomWallet'

import rawIdl from '../../idl/absolute_monarchy.json';

// Define a custom IDL type that extends Anchor's Idl
interface CustomIdl extends Idl {
  address: string;
  metadata: {
    name: string;
    version: string;
    spec: string;
    description: string;
  };
}

// Cast the imported IDL to the custom type
const idl: CustomIdl = rawIdl as CustomIdl;

type AbsoluteMonarchyIDL = typeof idl;

interface InitializeAbsoluteMonarchyArgs {
  name: string;
  description: string;
  monarchName: string;
  divineMandate: string;
  collectionPrice: BN;
  nftSupply: BN;
  splSupply: BN;
  royalDecreeThreshold: BN;
  minLoyaltyAmount: BN;
  membershipTokensThreshold: BN;
  knighthoodPrice: BN;
  // 7. Fix: Handle `nftConfig` and `splConfig` more safely with nullish coalescing later in code.
  nftConfig: { tokenType: { new: {} } | { existing: {} }; customMint: PublicKey | null } | null;
  splConfig: { tokenType: { new: {} } | { existing: {} }; customMint: PublicKey | null } | null;
  primaryKingdomToken: { nft: {} } | { spl: {} };
  initializeSbt: boolean;
}

interface DecreeArgs {
  decreeText: string;
  decreeType: { law: {} } | { economicPolicy: {} } | { militaryOrder: {} } | { royalProclamation: {} };
}

export class AbsoluteMonarchyClient {
  private program: Program<AbsoluteMonarchyIDL>;

  constructor(
    private connection: Connection,
    private wallet: CustomWallet,
    private programId: PublicKey
  ) {
    if (!wallet.publicKey) {
      throw new Error("Wallet is not connected. Please connect your wallet before initializing the client.");
    }
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    this.program = new Program(idl, provider);
  }

  private getKingdomPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('kingdom'), this.wallet.publicKey.toBuffer()],
      this.program.programId
    );
  }

  private getMonarchPDA(kingdomPDA: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('monarch'), kingdomPDA.toBuffer()],
      this.program.programId
    );
  }

  public async initializeAbsoluteMonarchy(args: InitializeAbsoluteMonarchyArgs): Promise<string> {
    const [kingdomPDA] = this.getKingdomPDA();
    const [monarchPDA] = this.getMonarchPDA(kingdomPDA);

    try {
      const tx = await this.program.methods
        .initializeAbsoluteMonarchy({
          ...args,
          nftConfig: args.nftConfig ?? null,
          splConfig: args.splConfig ?? null,
        })
        .accounts({
          kingdom: kingdomPDA,
          monarch: monarchPDA,
          authority: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error("Detailed error:", error);
      if (error instanceof AnchorError) {
        throw new Error(`Anchor error initializing absolute monarchy: ${error.message}\nError Code: ${error}\nError Name: ${error.name}`);
      } else if (error instanceof Error) {
        throw new Error(`Error initializing absolute monarchy: ${error.message}`);
      } else {
        throw new Error(`Unknown error initializing absolute monarchy: ${String(error)}`);
      }
    }
  }

  public async decree(args: DecreeArgs): Promise<string> {
    // 3. Fix: Reuse the `getKingdomPDA()` and `getMonarchPDA()` methods here as well.
    const [kingdomPDA] = this.getKingdomPDA();
    const [monarchPDA] = this.getMonarchPDA(kingdomPDA);

    const [decreePDA] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('decree'), monarchPDA.toBuffer()],
      this.program.programId
    );

    try {
      // 5. Fix: Add a check to ensure `args` is valid before proceeding.
      if (!args.decreeText || !args.decreeType) {
        throw new Error("Invalid decree arguments provided.");
      }

      const { decreeText, decreeType } = args;  // Safe destructuring after validation.

      const tx = await this.program.methods
        .decree(decreeText, decreeType)
        .accounts({
          kingdom: kingdomPDA,
          monarch: monarchPDA,
          decree: decreePDA,
          authority: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return tx;
    } catch (error) {
      // 4. Fix: Improve error handling with more specific messaging.
      if (error instanceof AnchorError) {
        console.error("Anchor-specific error occurred:", error);
      } else {
        console.error("Unknown error issuing decree:", error);
      }
      throw error;
    }
  }
  // Add more methods for other instructions here...
}

// 3. Fix: Refactor `createAbsoluteMonarchyClient` to use the new constructor.
export function createAbsoluteMonarchyClient(
  connection: Connection,
  wallet: CustomWallet,
  programId: PublicKey
): AbsoluteMonarchyClient {
  return new AbsoluteMonarchyClient(connection, wallet, programId);
}

// 6. Fix: Handle the case where `wallet` is null and ensure proper memoization.
export function useAbsoluteMonarchyClient(
  connection: Connection,
  wallet: CustomWallet,
  programId: PublicKey
): AbsoluteMonarchyClient | null {
  return useMemo(() => {
    if (wallet && wallet.publicKey) {
      try {
        return new AbsoluteMonarchyClient(connection, wallet, programId);
      } catch (error) {
        console.error("Failed to create AbsoluteMonarchyClient:", error);
        return null;
      }
    }
    return null;
  }, [connection, wallet, programId]);
}