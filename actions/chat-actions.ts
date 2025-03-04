"use server";

import { auth } from "@clerk/nextjs/server";
import { getNoteByIdAction } from "./notes-actions";

// 添加超时控制的 fetch 函数
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 0 } // 禁用缓存
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function createChatAction({ 
  noteId, 
  messages 
}: { 
  noteId: string;
  messages: { role: 'user' | 'assistant'; content: string; }[];
}) {
  console.log('开始处理聊天请求:', { noteId, messagesCount: messages.length });
  
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log('用户未登录');
      return { status: 'error', message: '未登录' };
    }

    const { data: note } = await getNoteByIdAction(noteId);
    if (!note) {
      console.log('笔记不存在:', noteId);
      return { status: 'error', message: '笔记不存在' };
    }

    console.log('准备发送到 Deepseek API:', {
      noteId,
      noteTitle: note.title,
      contentLength: note.content.length,
      lastMessage: messages[messages.length - 1]?.content
    });

    try {
      const response = await fetchWithTimeout(
        'https://api.deepseek.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: "system",
                content: `你是一个助手，帮助用户理解和分析以下笔记内容：\n\n${note.content}\n\n请基于笔记内容回答用户的问题。如果问题超出笔记范围,你可以补充笔记内容。`
              },
              ...messages
            ],
            temperature: 0.7,
            max_tokens: 1000 // 减少 token 数量
          })
        },
        50000 // 设置为 8 秒以确保在 Vercel 10 秒限制内完成
      );

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const completion = await response.json();
      console.log('API 响应成功:', {
        responseLength: completion.choices[0].message.content.length
      });

      return {
        status: 'success',
        data: {
          content: completion.choices[0].message.content
        }
      };
    } catch (error) {
      throw new Error('API 请求超时');
    }
  } catch (error) {
    console.error('聊天处理错误:', { error, noteId });
    return { 
      status: 'error', 
      message: '请求超时，请重试'
    };
  }
} 