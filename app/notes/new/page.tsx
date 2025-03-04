import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoteEditor } from "@/components/notes/NoteEditor";

export default async function NewNotePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">新建笔记</h1>
      <NoteEditor note={{
        id: '',
        title: '',
        content: '',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }} />
    </div>
  );
} 