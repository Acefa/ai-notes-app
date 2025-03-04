"use client";

import { SelectNote } from "@/db/schema/notes-schema";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DeleteNoteDialog } from "../DeleteNoteDialog";
import { FileTextIcon, Calendar, CircleDot } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export function NoteItem({ note }: { note: SelectNote }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === `/notes/${note.id}`;

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "w-full group relative px-3 py-2 h-auto cursor-pointer",
        "hover:bg-accent/50 transition-colors duration-200",
        "rounded-md",
        isActive && [
          "bg-accent/60 before:absolute before:left-0 before:top-1/2",
          "before:-translate-y-1/2 before:w-1 before:h-4",
          "before:bg-primary before:rounded-full"
        ]
      )}
      onClick={() => router.push(`/notes/${note.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          router.push(`/notes/${note.id}`);
        }
      }}
    > 
      <div className="flex flex-col w-full gap-1 items-start">
        <div className="flex items-center gap-2 w-full">
          {isActive ? (
            <CircleDot className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <FileTextIcon className="h-4 w-4 shrink-0 text-muted-foreground/70" />
          )}
          <span className={cn(
            "truncate text-sm flex-1",
            isActive ? "font-medium" : "font-normal text-foreground/80"
          )}>
            {note.title}
          </span>
          <div className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isActive && "opacity-100"
          )}>
            <DeleteNoteDialog noteId={note.id} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 pl-6">
          <Calendar className="h-3 w-3 text-muted-foreground/50" />
          <span className="text-[10px] text-muted-foreground/70">
            {format(new Date(note.createdAt), "MM月dd日 HH:mm", { locale: zhCN })}
          </span>
        </div>
      </div>
    </div>
  );
} 