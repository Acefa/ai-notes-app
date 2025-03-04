"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function CreateNoteButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);

  async function handleClick() {
    try {
      setIsNavigating(true);
      await router.push("/notes/new");
    } catch (error) {
      toast({
        title: "导航错误",
        description: "无法跳转到新建笔记页面",
        variant: "destructive",
      });
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