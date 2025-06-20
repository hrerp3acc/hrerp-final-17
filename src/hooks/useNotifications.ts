
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  module: string;
  timestamp: string;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only last 50
    
    // Show toast for important notifications
    if (notification.type === 'success' || notification.type === 'warning') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'warning' ? 'destructive' : 'default'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen for cross-module updates and create notifications
  useEffect(() => {
    const channels: any[] = [];

    // Employee updates
    const employeeChannel = supabase
      .channel('employee-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'employees'
      }, (payload) => {
        addNotification({
          title: 'New Employee Added',
          message: `${payload.new.first_name} ${payload.new.last_name} has been added to the system`,
          type: 'success',
          module: 'employees'
        });
      })
      .subscribe();

    channels.push(employeeChannel);

    // Leave application updates
    const leaveChannel = supabase
      .channel('leave-notifications')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'leave_applications'
      }, (payload) => {
        if (payload.new.status !== payload.old.status) {
          addNotification({
            title: 'Leave Status Updated',
            message: `A leave application has been ${payload.new.status}`,
            type: payload.new.status === 'approved' ? 'success' : 'info',
            module: 'leave'
          });
        }
      })
      .subscribe();

    channels.push(leaveChannel);

    // Course completion updates
    const courseChannel = supabase
      .channel('course-notifications')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'course_enrollments'
      }, (payload) => {
        if (payload.new.status === 'completed' && payload.old.status !== 'completed') {
          addNotification({
            title: 'Course Completed',
            message: 'An employee has completed a training course',
            type: 'success',
            module: 'learning'
          });
        }
      })
      .subscribe();

    channels.push(courseChannel);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };
};
