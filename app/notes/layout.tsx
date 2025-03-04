import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NotesSidebar } from "@/components/notes/sidebar/NotesSidebar";
import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="flex-1 flex flex-col min-h-0 w-full">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-center">我的笔记</h1>
            </div>
           
          </div>
        </header>
        <main className="flex-1 flex flex-col min-h-0 w-full">
          <ScrollArea className="flex-1 w-full">
            <div className="w-full h-full">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
} 