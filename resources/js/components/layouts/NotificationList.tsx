import React from "react";
import { NotificationItem, type Notification } from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export function NotificationList({
  notifications,
  onNotificationClick,
}: NotificationListProps) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            onClick={() => onNotificationClick(notification)}
          >
            <NotificationItem notification={notification} />
          </li>
        ))}
      </ul>
    </div>
  );
}
