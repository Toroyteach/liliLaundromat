import React from "react";
import type { Notification } from "./NotificationItem";

interface NotificationDetailsModalProps {
  notification: Notification;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDetailsModal({
  notification,
  isOpen,
  onClose,
}: NotificationDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Notification Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Message:</strong> {notification.title}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Time:</strong> 00.00.00
          </p>
          <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded-md">
            {notification.description}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
