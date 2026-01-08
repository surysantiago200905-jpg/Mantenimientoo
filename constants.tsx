
import React from 'react';

export const CUSTOMS_LOCATIONS = [
  { id: '1', name: 'Aduana de Nuevo Laredo', city: 'Tamaulipas', code: 'NL-01' },
  { id: '2', name: 'Aduana de Tijuana', city: 'Baja California', code: 'TJ-02' },
  { id: '3', name: 'Aduana de Veracruz', city: 'Veracruz', code: 'VC-03' },
  { id: '4', name: 'Aduana del Aeropuerto CDMX', city: 'Ciudad de México', code: 'AICM-04' },
];

export const USERS = [
  { id: 'u1', name: 'Carlos Rivera', role: 'Admin', avatar: 'https://picsum.photos/seed/carlos/100/100' },
  { id: 'u2', name: 'Ana Martinez', role: 'Manager', avatar: 'https://picsum.photos/seed/ana/100/100' },
  { id: 'u3', name: 'Luis Gomez', role: 'Technician', avatar: 'https://picsum.photos/seed/luis/100/100' },
];

export const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};
