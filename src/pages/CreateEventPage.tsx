import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventRq } from '../types/types'; // предположим, у тебя есть типы для запроса
import { useEvents } from '../context/EventContext'; // кастомный хук для работы с событиями

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent } = useEvents(); // функция для создания события через API
  const [form, setForm] = useState<EventRq>({
    title: '',
    description: '',
    eventDate: '',
    location: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createEvent(form);
      navigate('/events'); // после создания возвращаем на список событий
    } catch (err) {
      setError('Ошибка при создании события, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Создать событие
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Введите название события"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Описание события"
            />
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-gray-700 mb-1">
              Дата и время
            </label>
            <input
              type="datetime-local"
              id="eventDate"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-700 mb-1">
              Место
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Место проведения"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Создание...' : 'Создать событие'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
