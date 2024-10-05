import { PublicKey, Transaction, Connection } from '@solana/web3.js';
import * as multisig from '@sqds/multisig';
import { toast } from 'react-toastify';

const { Permission, Permissions } = multisig.types;

interface CreateMultisigParams {
  publicKey: PublicKey;
  connection: Connection;
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>;
  members: string[];
  threshold: number;
  name: string;
  onMultisigCreated: (multisigPda: PublicKey, name: string) => void;
}

export const createMultisig = async ({
  publicKey,
  connection,
  sendTransaction,
  members,
  threshold,
  name,
  onMultisigCreated,
}: CreateMultisigParams) => {
  if (!publicKey) {
    toast.error('Please connect your wallet first');
    return;
  }

  try {
    const [multisigPda] = multisig.getMultisigPda({ createKey: publicKey });
    const [programConfigPda] = multisig.getProgramConfigPda({});

    const programConfig = await multisig.accounts.ProgramConfig.fromAccountAddress(
      connection,
      programConfigPda
    );

    const configTreasury = programConfig.treasury;

    const membersList = members.map(member => ({
      key: new PublicKey(member),
      permissions: Permissions.all(),
    }));

    const ix = await multisig.instructions.multisigCreateV2({
      createKey: publicKey,
      creator: publicKey,
      multisigPda,
      configAuthority: null,
      timeLock: 0,
      members: membersList,
      threshold,
      treasury: configTreasury,
      rentCollector: null,
    });

    const transaction = new Transaction().add(ix);
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    onMultisigCreated(multisigPda, name);
    toast.success('Multisig created successfully!');
  } catch (error) {
    toast.error('Error creating multisig');
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
};

// Example Usage in another component
// import React, { useCallback } from 'react';
// import { createMultisig } from './multisigUtils';
// import { useWallet } from '@solana/wallet-adapter-react';

// AFTER IMPORTING:

// const SomeComponent = () => {
//   const { publicKey, sendTransaction } = useWallet();
//   const connection = new Connection('https://api.devnet.solana.com');

//   const handleCreateMultisig = useCallback((e: React.FormEvent) => {
//     e.preventDefault();
//     const members = ['PublicKey1', 'PublicKey2'];  // Example member public keys
//     const threshold = 2;
//     const name = 'My Multisig';
    
// WE CALL THE FUNCTION HERE:

//     createMultisig({
//       publicKey,
//       connection,
//       sendTransaction,
//       members,
//       threshold,
//       name,
//       onMultisigCreated: (multisigPda, multisigName) => {
//         console.log('Multisig created:', multisigPda, multisigName);
//       }
//     });
//   }, [publicKey, sendTransaction, connection]);

//   return (
//     <button onClick={handleCreateMultisig}>Create Multisig</button>
//   );
// };

// export default SomeComponent;
