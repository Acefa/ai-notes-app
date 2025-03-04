"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { SelectNote } from "@/db/schema/notes-schema";
import { MessageSquarePlusIcon, SendIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { createChatAction } from "@/actions/chat-actions";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatSidebar({ note }: { note: SelectNote }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await createChatAction({
        noteId: note.id,
        messages: [...messages, userMessage],
      });

      if (result.status === 'error') throw new Error(result.message);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.data?.content || ''
      }]);
    } catch (error) {
      toast.error("发送消息失败");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 头部 - 与 NoteEditor 保持一致的高度和样式 */}
      <div className="flex-none px-6 py-3 border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button 
          variant="secondary" 
          className="w-full gap-2"
          onClick={() => setMessages([])}
        >
          <MessageSquarePlusIcon className="h-4 w-4" />
          新对话
        </Button>
      </div>
      
      {/* 消息区域 - 动态计算高度，与 NoteEditor 内容区保持一致 */}
      <div className="flex-1 overflow-auto bg-muted/10">
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-full px-6"
        >
          <div className="max-w-3xl mx-auto py-6 space-y-4">
            {messages.map((message, i) => (
              <ChatMessage key={i} message={message} />
            ))}
            {isLoading && (
              <div className="h-8 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">AI正在思考...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="flex-none px-6 py-3 border-t bg-background/95">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="询问关于笔记的问题..."
            className="min-h-[80px] max-h-[160px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 