"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateNoteButton() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  async function handleClick() {
    try {
      setIsNavigating(true);
      await router.push("/notes/new");
    } catch {
      toast.error("创建笔记失败");
    } finally {
      setIsNavigating(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      className="w-full shadow-sm"
      size="default"
      variant="default"
      disabled={isNavigating}
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      {isNavigating ? "跳转中..." : "新建笔记"}
    </Button>
  );
} 