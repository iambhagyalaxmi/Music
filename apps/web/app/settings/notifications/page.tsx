import React from 'react';
import { Bell } from 'lucide-react';
import { ComingSoon } from '../../../components/settings/ComingSoon';

export default function NotificationsSettingsPage() {
  return (
    <ComingSoon 
      title="Notifications" 
      description="Customize your push notifications, email alerts, and in-app updates to stay on top of your community activity."
      icon={Bell}
    />
  );
}
