import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";

// export async function GET (request:Request) {
//     const response:ActionGetResponse ={
//         description: "Vote on this particular thing",
//         icon: "https://static.vecteezy.com/system/resources/previews/009/663/724/original/sun-sun-ray-icon-transparent-free-png.png",
//         label: "Vote",
//         title:"Vote for your particular dao",

//     }
//     return Response.json(response, headers = ACTIONS_CORS_HEADERS)
// }

export async function GET(req: Request) {
  const response: ActionGetResponse = {
    description: "Vote on this particular thing",
    icon: new URL("/images/ark.jpg",new URL(req.url).origin).toString(),
    title: "Vote for this nigga",
    label: "Vote for your particular dao",
    links: {
      actions: [
        {
          type: "transaction",
          href: "Testing something",
          label: "Approve Proposal",
        },
        {
          type: "transaction",
          href: "Testing something",
          label: "Reject Proposal",
        },
      ],
    },
  };

  return new Response(JSON.stringify(response), {
    headers: ACTIONS_CORS_HEADERS, // Pass headers correctly inside an object
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
