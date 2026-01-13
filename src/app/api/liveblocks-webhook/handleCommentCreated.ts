import {
  CommentBody,
  CommentCreatedEvent,
  getMentionsFromCommentBody,
} from "@liveblocks/node";
import { liveblocks } from "./route";
import { AI_USER } from "../database";

export async function handleCommentCreated(event: CommentCreatedEvent) {
  console.log("CommentCreated:", event.data.commentId);
  // console.log(event);

  const { roomId, threadId, commentId } = event.data;

  // Fetch the created comment
  const comment = await liveblocks.getComment({ roomId, threadId, commentId });

  if (!comment.body || comment.userId === AI_USER.id) {
    // Comment has been deleted, or was created by AI, ignore
    console.log("Comment has been deleted, or was created by AI, ignore");
    return new Response(null, { status: 200 });
  }

  // Check mentions in the comment's body
  const mentions = getMentionsFromCommentBody(comment.body);

  if (!mentions.some((mention) => mention.id === AI_USER.id)) {
    // AI user was not mentioned, ignore
    console.log("AI user was not mentioned, ignore");
    return new Response(null, { status: 200 });
  }

  // Leave a reaction on the comment to indicate that AI has seen it
  await liveblocks.addCommentReaction({
    roomId,
    threadId,
    commentId,
    data: {
      emoji: "👀",
      userId: AI_USER.id,
      createdAt: new Date(),
    },
  });

  // Create a new comment indicating progress is occurring
  const commentLoadingBody: CommentBody = {
    version: 1,
    content: [
      {
        type: "paragraph",
        children: [{ text: "AI magic in progress…" }],
      },
    ],
  };

  // Send the progress comment as an AI response
  const aiComment = await liveblocks.createComment({
    roomId,
    threadId,
    data: {
      body: commentLoadingBody,
      userId: AI_USER.id,
      createdAt: new Date(),
    },
  });

  // Use n8n to do AI magic
  // ...
  await new Promise((resolve) => setTimeout(resolve, 4000)); // Replace

  // Structure a new comment with the results
  const commentCompleteBody: CommentBody = {
    version: 1,
    content: [
      {
        type: "paragraph",
        children: [{ text: "AI magic completed! Here's the results." }],
      },
      {
        type: "paragraph",
        children: [
          { text: "Use " },
          { text: "bold, ", bold: true },
          { text: "italic, ", italic: true },
          { text: "strikethrough, ", strikethrough: true },
          { text: "and code.", code: true },
        ],
      },
      {
        type: "paragraph",
        children: [
          { text: "Also you can tag " },
          { type: "mention", kind: "user", id: AI_USER.id },
          { text: " users and " },
          {
            type: "link",
            text: "link elsewhere",
            url: "https://liveblocks.io",
          },
        ],
      },
    ],
  };

  console.log("Editing AI comment with the final results");
  // Edit your AI comment with the final results
  await liveblocks.editComment({
    roomId,
    threadId: aiComment.threadId,
    commentId: aiComment.id,

    data: {
      body: commentCompleteBody,
      editedAt: new Date(),
    },
  });

  console.log("AI comment edited");

  return new Response(null, { status: 200 });
}
