"use client";

import { SelectNote } from "@/db/schema/notes-schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { useRouter } from "next/navigation";

export function NoteCard({ note }: { note: SelectNote }) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2 line-clamp-1">{note.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button
          onClick={() => router.push(`/notes/${note.id}`)}
          className="text-sm text-blue-500 hover:underline"
        >
          编辑
        </button>
        <DeleteNoteDialog noteId={note.id} />
      </CardFooter>
    </Card>
  );
} 