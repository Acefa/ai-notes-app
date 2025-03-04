import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { NoteList } from "@/components/notes/NoteList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NotesPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const {data} = await getProfileByUserIdAction(userId);
  if (!data) {
    redirect("/signup");
  }

  if(data.membership === "free"){
    redirect("/pricing");
  }

  return (
    <div className="container mx-auto py-8">
      <NoteList userId={userId} />
    </div>
  )
}