import { getNoteByIdAction } from "@/actions/notes-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface PageProps {
  params: {
    noteId: string;
  };
}

export default async function NotePage({ params: { noteId } }: PageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const { data: note } = await getNoteByIdAction(noteId);
  if (!note) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-2">未找到笔记</h2>
          <p className="text-muted-foreground">
            该笔记可能已被删除或您没有访问权限
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="h-screen overflow-hidden"
    >
      <ResizablePanel 
        defaultSize={65}
        minSize={40}
        maxSize={75}
        className="overflow-hidden"
      >
        <div className="h-full overflow-hidden">
          <NoteEditor note={note} />
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel 
        defaultSize={35}
        minSize={25}
        maxSize={60}
        className="overflow-hidden"
      >
        <div className="h-full overflow-hidden">
          <ChatSidebar note={note} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
} 