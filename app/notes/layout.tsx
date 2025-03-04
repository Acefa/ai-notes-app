import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NotesSidebar } from "@/components/notes/sidebar/NotesSidebar";
import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const { data } = await getProfileByUserIdAction(userId);
  if (!data) {
    redirect("/signup");
  }

  if (data.membership === "free") {
    redirect("/pricing");
  }

  return (
    <div className="flex h-screen bg-background/95 dark:bg-background/95">
      <NotesSidebar userId={userId} />
      <div className="flex-1 flex flex-col min-h-0">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-6 gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-semibold">我的笔记</h1>
            </div>
            
          </div>
        </header>
        <main className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="container max-w-3xl py-6 px-4">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
} 