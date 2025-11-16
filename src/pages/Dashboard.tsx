import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchUserInfo } = useAuth();
  const [loading, setLoading] = useState(true);

  const cards = [
    {
      title: 'Мой профиль',
      description: 'Посмотреть и изменить информацию о себе',
      color: 'from-indigo-500 to-indigo-700',
      onClick: () => navigate('/profile'),
      requiredRoles: null,
    },
    {
      title: 'Ивенты',
      description: 'Просмотр и участие в событиях',
      color: 'from-purple-500 to-purple-700',
      onClick: () => navigate('/events'),
      requiredRoles: null,
    },
    {
      title: 'Настройки',
      description: 'Изменение пароля, уведомлений и других параметров',
      color: 'from-pink-500 to-pink-700',
      onClick: () => navigate('/settings'),
      requiredRoles: null,
    },
    {
      title: 'Создать ивент',
      description: 'Создание нового ивента',
      color: 'from-emerald-500 to-emerald-700',
      onClick: () => navigate('/create-event'),
      requiredRoles: ['ADMIN', 'ORGANIZER'],
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchUserInfo();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [fetchUserInfo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <p className="text-white text-xl">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Блок с приветствием */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Добро пожаловать, {user?.firstname || 'Пользователь'}!
            </h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">Роль: {user?.role}</p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(
            (card, index) =>
              (card.requiredRoles?.includes(user?.role as string) ||
                card.requiredRoles === null) && (
                <div
                  key={index}
                  onClick={card.onClick}
                  className={`cursor-pointer bg-gradient-to-br ${card.color} rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105 hover:shadow-2xl`}
                >
                  <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
