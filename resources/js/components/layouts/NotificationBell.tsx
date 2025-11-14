import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Drawer } from "vaul";
import { NotificationList } from "./NotificationList";
import type { Notification } from "./NotificationItem";
import { NotificationDetailsModal } from "./NotificationDetailsModal";

// Mock data for demonstration
const mockNotifications: Notification[] = [
  {
    id: "1",
    icon: Bell, // Assuming Bell icon for all mock notifications
    title: "New order #12345 has been created.",
    description: "Order details for #12345: 5 shirts, 2 pants. Total: $55.00",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    href: "/orders/12345",
  },
  {
    id: "2",
    icon: Bell,
    title: "Order #12340 has been processed.",
    description: "Order #12340 is now ready for pickup.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    href: "/orders/12340",
  },
  {
    id: "3",
    icon: Bell,
    title: "User 'John Doe' has been activated.",
    description: "John Doe's account is now active and can place orders.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    href: "/users/john-doe",
  },
  {
    id: "4",
    icon: Bell,
    title: "New order #12344 has been created.",
    description: "Order details for #12344: 1 blanket. Total: $10.00",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    href: "/orders/12344",
  },
  {
    id: "5",
    icon: Bell,
    title: "User 'Jane Smith' has been deactivated.",
    description: "Jane Smith's account has been deactivated due to inactivity.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    href: "/users/jane-smith",
  },
  {
    id: "6",
    icon: Bell,
    title: "Order #12333 has been delivered.",
    description: "Order #12333 was successfully delivered.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    href: "/orders/12333",
  },
];

export function NotificationBell() {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <>
      <Drawer.Root shouldScaleBackground>
        <Drawer.Trigger asChild>
          <button className="relative rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-8" />
              <NotificationList
                notifications={mockNotifications.slice(0, 5)}
                onNotificationClick={handleNotificationClick}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      {selectedNotification && (
        <NotificationDetailsModal
          notification={selectedNotification}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
