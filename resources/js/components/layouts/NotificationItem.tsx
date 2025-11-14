import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import type { LucideIcon } from "lucide-react";

export interface Notification {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: Date;
  href: string;
  read?: boolean;
}

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-start gap-3 p-3 -m-3 rounded-lg hover:bg-secondary cursor-pointer">
          <notification.icon className="w-5 h-5 text-muted-foreground mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {notification.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{notification.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            {notification.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
