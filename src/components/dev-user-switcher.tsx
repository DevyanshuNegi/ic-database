"use client";

import { useTransition, useState, useEffect } from "react";
import { switchUserAction } from "@/app/actions/switch-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";

export function DevUserSwitcher() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const isMockAuthEnabled =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH?.trim() === "true";

  useEffect(() => {
    if (!isMockAuthEnabled) return;
    fetch("/api/dev/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setActiveUserId(data.activeUserId || data.users[0]?.id || "");
      })
      .catch(console.error);
  }, [isMockAuthEnabled]);

  if (!isMockAuthEnabled) {
    return null;
  }

  if (!users.length) {
    return <div className="text-sm text-muted-foreground">Loading users...</div>;
  }

  return (
    <div className="flex items-center gap-2 border-l pl-4 ml-4">
      <span className="text-xs text-muted-foreground whitespace-nowrap">Dev Switcher:</span>
      <Select
        value={activeUserId}
        onValueChange={(val) => {
          if (!val) return;
          setActiveUserId(val);
          startTransition(() => {
            switchUserAction(val);
          });
        }}
        disabled={isPending}
      >
        <SelectTrigger className="w-[200px] h-8 text-xs">
          <SelectValue placeholder="Switch user..." />
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id} className="text-xs">
              {u.name} <span className="text-muted-foreground">({u.role})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
