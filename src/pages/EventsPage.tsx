import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Event } from '../types/types';

const EventsPage: React.FC = () => {
  const { user, token } = useAuth();
  const { fetchEvents } = useEvents();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      loadEvents().then();
    }
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить ивент?')) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/events/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Ошибка удаления');
      setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 p-6 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Список событий</h1>

        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-black"
          />
          {['ADMIN', 'ORGANIZER'].includes(user?.role as string) && (
            <button
              onClick={() => navigate('/events/create')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold"
            >
              Создать ивент
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white text-gray-900 rounded-xl shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="mb-2 text-sm text-gray-700">
                  {event.description}
                </p>
                <p className="text-sm text-gray-500">
                  📅 {new Date(event.eventDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">📍 {event.location}</p>
                <p className="text-sm text-gray-500">
                  👥 Участников: {event.participantsCount}
                </p>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                >
                  Подробнее
                </button>
                {['ADMIN', 'ORGANIZER'].includes(user?.role as string) && (
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <p className="text-center text-white mt-8">Нет доступных событий</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
