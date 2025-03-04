import { getNoteByIdAction } from "@/actions/notes-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoteEditor } from "@/components/notes/NoteEditor";

interface PageProps {
  params: Promise<{ noteId: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { noteId } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/login");
  }

  const result = await getNoteByIdAction(noteId);
  
  if (result.status === 'error' || !result.data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
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
    <div className="flex-1 flex flex-col h-full">
      <NoteEditor note={result.data} />
    </div>
  );
} 