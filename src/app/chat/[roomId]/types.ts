/**
 * Message data structure for chat messages
 */
export type ChatMessageData = {
  id: string;
  userId?: string; // undefined for AI messages
  content: string;
};

/**
 * Full message structure as stored in agent session
 */
export type AgentSessionMessage = {
  id: string;
  timestamp: number;
  data: ChatMessageData;
};

/**
 * Message payload for creating a message in agent session
 */
export type CreateMessagePayload = {
  id: string;
  timestamp: number;
  data: ChatMessageData;
};
