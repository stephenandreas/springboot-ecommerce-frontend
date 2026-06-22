import { apiFetch } from "@/lib/api";
import type { ChatMessage, Conversation, PagedResponse } from "@/types";

export async function listConversations(token: string): Promise<Conversation[]> {
  try {
    return (await apiFetch<PagedResponse<Conversation>>("/chat/conversations?page=0&size=50", { token })).content;
  } catch {
    return [];
  }
}
export async function getMessages(conversationId: string, token: string): Promise<ChatMessage[]> {
  const p = await apiFetch<PagedResponse<ChatMessage>>(`/chat/conversations/${conversationId}/messages?page=0&size=100`, { token });
  return p.content;
}
export function sendMessage(conversationId: string, content: string, token: string): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(`/chat/conversations/${conversationId}/messages`, { method: "POST", token, body: { content } });
}
export function markConversationRead(conversationId: string, token: string): Promise<void> {
  return apiFetch<void>(`/chat/conversations/${conversationId}/read`, { method: "PUT", token });
}
export function startConversation(input: { sellerId?: string; storeId?: string; productId?: string }, token: string): Promise<Conversation> {
  return apiFetch<Conversation>("/chat/conversations", { method: "POST", token, body: input });
}
