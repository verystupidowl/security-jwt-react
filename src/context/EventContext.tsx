import React, { createContext, ReactNode, useContext } from 'react';
import { Event, EventRq } from '../types/types';
import { useAuth } from './AuthContext';

interface EventContextType {
  createEvent: (event: EventRq) => Promise<void>;
  fetchEvents: () => Promise<Event[]>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();

  const createEvent = async (event: EventRq) => {
    if (!token) throw new Error('Не авторизован');

    const response = await fetch('http://localhost:8080/api/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.msg || 'Ошибка создания события');
    }
  };

  const fetchEvents = async () => {
    const response = await fetch('http://localhost:8080/api/v1/events/filter', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Не удалось загрузить ивенты');
    return await response.json();
  };

  return (
    <EventContext.Provider value={{ createEvent, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents должен использоваться внутри EventProvider');
  }
  return context;
};
