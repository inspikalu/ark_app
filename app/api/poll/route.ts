import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  ActionPostRequest,
  ActionPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import * as multisig from "@sqds/multisig";

export async function GET(req: Request) {
  const response: ActionGetResponse = {
    type: "action",
    description: "Create a new poll",
    title: "Poll Creation",
    icon: new URL("/images/ark.jpg", new URL(req.url).origin).toString(),
    links: {
      actions: [
        {
          type: "post",
          label: "Create Poll",
          href: "/api/create-poll",
          parameters: [
            {
              name: "title",
              label: "Enter Poll Title",
              required: true,
            },
            {
              name: "content",
              label: "Enter Poll Content",
              required: true,
            },
          ],
        },
      ],
    },
    label: "Submit Poll",
  };
  return new Response(JSON.stringify(response), {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export const OPTIONS = GET;

export async function POST(request: Request) {
  const postRequest: ActionPostRequest = await request.json();
  const userPubKey = new PublicKey(postRequest.account);

  // Initialize connection to Solana network
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  try {
    // Fetch multisig PDA (you need to implement this function)
    const multisigPda = await getMultisigPda(userPubKey);

    // Fetch multisig info
    const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
      connection,
      multisigPda
    );

    const transactionIndex = Number(multisigInfo.transactionIndex);

    // Create proposal instruction
    const ix = await multisig.instructions.proposalCreate({
      multisigPda,
      transactionIndex: BigInt(transactionIndex),
      creator: userPubKey,
    });

    // Create and populate transaction
    const transaction = new Transaction().add(ix);
    transaction.feePayer = userPubKey;
    const blockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const response: ActionPostResponse = {
      transaction: serializedTransaction.toString("base64"),
      message: "Poll creation proposal ready for signing",
    };

    return new Response(JSON.stringify(response), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create poll proposal" }),
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
}

// You need to implement this function to get the multisig PDA
async function getMultisigPda(userPubKey: PublicKey): Promise<PublicKey> {
  // Implementation depends on how you're storing/deriving the multisig PDA
  // This is just a placeholder
  return PublicKey.findProgramAddressSync(
    [Buffer.from("multisig"), userPubKey.toBuffer()],
    new PublicKey("YOUR_PROGRAM_ID_HERE")
  )[0];
}

/**
import {
  ActionGetRequest,
  ACTIONS_CORS_HEADERS,
  ActionPostRequest,
  ActionPostResponse,
} from "@solana/actions";


export async function GET(req: Request) {
  const response: ActionGetRequest = {
    description: "Create and Vote on a Poll",
    title: "Poll Creation",
    icon: new URL("/images/poll-icon.jpg", new URL(req.url).origin).toString(),
    links: {
      actions: [
        {
          label: "Create Poll",
          href: "/api/create-poll/{title}/{content}",
          parameters: [
            {
              name: "title",
              label: "Enter Poll Title",
              required: true,
            },
            {
              name: "content",
              label: "Enter Poll Content",
              required: true,
            }
          ]
        }
      ]
    },
    label: "Submit Poll",
  };
  
  return new Response(JSON.stringify(response), {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export const OPTIONS = GET;

export async function POST(request: Request) {
  const postRequest: ActionPostRequest = await request.json();
  const userPubKey = postRequest.account;

  const response: ActionPostResponse = {
    type: "transaction",
    transaction: "",
    message: "This is my message to you " + userPubKey,
  };

  return new Response(JSON.stringify(response), {
    headers: ACTIONS_CORS_HEADERS, // Pass headers correctly inside an object
  });
}
 */
