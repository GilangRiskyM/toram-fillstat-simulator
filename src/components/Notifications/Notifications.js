/**
 * Notifications component
 * Displays toast notifications for user feedback
 */

import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { NotificationContainer, Notification } from '../GlobalStyles';

function Notifications() {
  const { state } = useSimulator();

  if (!state.ui.notifications.length) {
    return null;
  }

  return (
    <NotificationContainer>
      {state.ui.notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          type={notification.type}
        >
          {notification.message}
        </Notification>
      ))}
    </NotificationContainer>
  );
}

export default Notifications;