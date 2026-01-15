import { Liveblocks } from "@liveblocks/node";
import { getUser } from "@/app/api/database";

export const liveblocks = new Liveblocks({
  // @ts-ignore - hidden config option
  baseUrl: "https://dev.dev-liveblocks5948.workers.dev/",
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function POST(request: Request) {
  const { room, userId } = await request.json();

  const user = getUser(userId);

  if (!user) {
    return new Response(
      JSON.stringify({ error: "forbidden", reason: "User not found" }),
      { status: 404 }
    );
  }

  const session = liveblocks.prepareSession(
    user.id,
    { userInfo: user.info } // Optional
  );

  /**
   * Implement your own security here.
   *
   * It's your responsibility to ensure that the caller of this endpoint
   * is a valid user by validating the cookies or authentication headers
   * and that it has access to the requested room.
   */
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
