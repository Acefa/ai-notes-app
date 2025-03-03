import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileByUserIdAction } from "@/actions/profiles-actions";

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
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Notes</h1>
    </div>
  )
}