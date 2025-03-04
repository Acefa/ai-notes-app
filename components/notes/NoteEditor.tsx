"use client";

import { useState } from "react";
import { SelectNote } from "@/db/schema/notes-schema";
import { updateNoteAction, createNoteAction } from "@/actions/notes-actions";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SaveIcon, ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NoteEditor({ note }: { note: SelectNote }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);
  const isNewNote = !note.id;

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("请输入笔记标题");
      return;
    }

    setIsSaving(true);
    try {
      if (isNewNote) {
        const result = await createNoteAction({
          title: debouncedTitle,
          content: debouncedContent,
          userId: note.userId
        });
        
        if (result.status === 'error') throw new Error("创建失败");
        toast.success("笔记已创建");
        router.push(`/notes/${result.data.id}`);
      } else {
        const result = await updateNoteAction(note.id, {
          title: debouncedTitle,
          content: debouncedContent,
        });
        
        if (result.status === 'error') throw new Error("保存失败");
        toast.success("笔记已保存");
        router.refresh();
      }
    } catch (error) {
      toast.error(isNewNote ? "创建失败" : "保存失败");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isNewNote && (!note.title || !note.content)) return;
      handleSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [handleSave, isNewNote, note.content, note.title]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center px-6 py-3 border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 w-full max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => router.push('/notes')}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            返回
          </Button>
          <div className="flex-1 flex items-center justify-center">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(
                "text-xl text-center font-bold bg-transparent border-0 px-0 h-auto",
                "focus-visible:ring-0 w-[50%] transition-all hover:w-[60%]",
                "placeholder:text-muted-foreground/40 placeholder:font-normal"
              )}
              placeholder="无标题笔记"
            />
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-sm text-muted-foreground">
                正在保存...
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="default"
              size="sm"
              className={cn(
                "gap-1.5 min-w-[100px] transition-all",
                isSaving && "bg-muted-foreground"
              )}
            >
              <SaveIcon className={cn(
                "h-4 w-4 transition-opacity",
                isSaving && "animate-pulse"
              )} />
              {isNewNote ? "创建笔记" : "保存更改"}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-muted/10">
        <div className="h-full max-w-3xl mx-auto px-6">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full h-full min-h-[calc(100vh-5rem)] resize-none bg-transparent",
              "border-0 p-6 focus-visible:ring-0 text-base leading-relaxed",
              "placeholder:text-muted-foreground/50"
            )}
            placeholder="开始写作..."
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 