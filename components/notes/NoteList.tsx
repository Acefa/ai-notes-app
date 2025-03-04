// Server Component
import { getNotesByUserIdAction } from "@/actions/notes-actions";
import { NoteCard } from "@/components/notes/NoteCard";
import { SelectNote } from "@/db/schema/notes-schema";

export async function NoteList({ userId }: { userId: string }) {
  const { data: notes } = await getNotesByUserIdAction(userId);
  
  if (!notes?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">还没有笔记，创建一个吧！</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note: SelectNote) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
} 