import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@vivaleve.com',
    password: 'admin123',
    plan: 'premium',
    planExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isAdmin: true,
    createdAt: new Date('2024-01-01'),
    weights: [],
    achievements: []
  },
  {
    id: '2',
    name: 'Maria Silva',
    email: 'maria@email.com',
    password: '123456',
    plan: 'premium',
    planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isAdmin: false,
    createdAt: new Date('2024-02-01'),
    weights: [
      { id: '1', weight: 75, date: new Date('2024-02-01'), notes: 'Peso inicial' },
      { id: '2', weight: 73.5, date: new Date('2024-02-08'), notes: 'Primeira semana' },
      { id: '3', weight: 72, date: new Date('2024-02-15'), notes: 'Segunda semana' },
      { id: '4', weight: 70.8, date: new Date('2024-02-22'), notes: 'Terceira semana' }
    ],
    achievements: [
      {
        id: '1',
        type: 'discipline',
        title: 'Disciplina',
        description: 'Registrou peso por 4 semanas consecutivas',
        unlockedAt: new Date('2024-02-22')
      }
    ]
  },
  {
    id: '3',
    name: 'João Santos',
    email: 'joao@email.com',
    password: '123456',
    plan: 'free',
    planExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isAdmin: false,
    createdAt: new Date('2024-02-15'),
    weights: [
      { id: '1', weight: 85, date: new Date('2024-02-15'), notes: 'Começando a jornada' }
    ],
    achievements: []
  }
];