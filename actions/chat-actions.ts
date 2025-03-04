"use server";

import { auth } from "@clerk/nextjs/server";
import { getNoteByIdAction } from "./notes-actions";

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

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API 请求失败:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error('API 请求失败');
    }

    const completion = await response.json();
    console.log('API 响应成功:', {
      responseLength: completion.choices[0].message.content.length,
      firstFewWords: completion.choices[0].message.content.slice(0, 50)
    });

    return {
      status: 'success',
      data: {
        content: completion.choices[0].message.content || '抱歉，我无法生成回应。'
      }
    };
  } catch (error) {
    console.error('聊天处理错误:', {
      error,
      noteId,
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content
    });
    return { status: 'error', message: '处理请求时出错' };
  }
} 