// Server Component
import { getNotesByUserIdAction } from "@/actions/notes-actions";
import { NoteItem } from "@/components/notes/sidebar/NoteItem";
import { CreateNoteButton } from "@/components/notes/sidebar/CreateNoteButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectNote } from "@/db/schema/notes-schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export async function NotesSidebar({ userId }: { userId: string }) {
  const { data: notes } = await getNotesByUserIdAction(userId);

  return (
    <Card className="w-80 h-screen rounded-none border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="p-4 pb-2 space-y-4">
        <CreateNoteButton />
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="搜索笔记..."
            className="pl-8 bg-background/50 focus:bg-background border-muted-foreground/20"
          />
        </div>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="p-0 h-[calc(100vh-8rem)]">
        <ScrollArea className="h-full px-2">
          <div className="space-y-1 py-2">
            {notes?.map((note: SelectNote) => (
              <NoteItem key={note.id} note={note} />
            ))}
            {!notes?.length && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-xl opacity-50"></div>
                  <div className="relative bg-card p-4 rounded-full ring-1 ring-black/5 dark:ring-white/10">
                    <span className="text-3xl">✨</span>
                  </div>
                </div>
                <div className="space-y-2 text-center max-w-[200px]">
                  <p className="text-sm font-medium text-foreground/80">开始创作</p>
                  <p className="text-sm text-muted-foreground">
                    点击&ldquo;新建笔记&rdquo;开始写作
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 