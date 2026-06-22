"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getProfile } from "@/lib/account";
import { listConversations, getMessages, sendMessage, markConversationRead } from "@/lib/chat";
import type { ChatMessage, Conversation } from "@/types";

export default function ChatPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [me, setMe] = useState<string | null>(null);
  const [convos, setConvos] = useState<Conversation[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/chat");
      return;
    }
    getProfile(token).then((p) => setMe(p.id)).catch(() => {});
    listConversations(token).then(setConvos);
  }, [isReady, token, router]);

  const loadMessages = useCallback(
    (id: string) => {
      if (!token) return;
      getMessages(id, token).then((m) => {
        setMessages(m);
        endRef.current?.scrollIntoView();
      });
      markConversationRead(id, token).catch(() => {});
    },
    [token],
  );

  // Poll the active conversation.
  useEffect(() => {
    if (!active || !token) return;
    loadMessages(active);
    const t = setInterval(() => loadMessages(active), 4000);
    return () => clearInterval(t);
  }, [active, token, loadMessages]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !active || !text.trim()) return;
    const content = text.trim();
    setText("");
    try {
      const msg = await sendMessage(active, content, token);
      setMessages((m) => [...m, msg]);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setText(content);
    }
  }

  return (
    <div className="mx-auto h-[calc(100vh-8rem)] max-w-5xl px-4 py-4">
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-[280px_1fr]">
        {/* Conversation list */}
        <aside className={cn("flex flex-col rounded-2xl bg-muted/50", active && "hidden md:flex")}>
          <p className="border-b border-background/50 p-4 font-semibold">Pesan</p>
          <div className="flex-1 overflow-y-auto p-2">
            {convos === null ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="mb-2 h-14 rounded-xl" />)
            ) : convos.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Belum ada percakapan.</p>
            ) : (
              convos.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={cn("flex w-full items-center gap-2 rounded-xl p-3 text-left text-sm transition-colors hover:bg-background", active === c.id && "bg-background")}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><MessageCircle className="size-4" /></span>
                  <span className="min-w-0 flex-1 truncate font-medium">Percakapan #{c.id.slice(0, 6)}</span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Thread */}
        <section className={cn("flex flex-col rounded-2xl bg-muted/50", !active && "hidden md:flex")}>
          {!active ? (
            <div className="grid flex-1 place-items-center">
              <EmptyState icon={MessageCircle} title="Pilih percakapan" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-background/50 p-3">
                <Button variant="ghost" size="icon" className="size-8 md:hidden" onClick={() => setActive(null)}><ArrowLeft className="size-4" /></Button>
                <p className="font-medium">Percakapan #{active.slice(0, 6)}</p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((m) => {
                  const mine = m.senderId === me;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <span className={cn("max-w-[75%] rounded-2xl px-3 py-2 text-sm", mine ? "bg-primary text-primary-foreground" : "bg-background")}>
                        {m.content}
                      </span>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
              <form onSubmit={onSend} className="flex gap-2 border-t border-background/50 p-3">
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan…" className="rounded-full border-0 bg-background" />
                <Button type="submit" size="icon" className="shrink-0 rounded-full" aria-label="Kirim"><Send className="size-4" /></Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
