import React from 'react';

// Componente base genérico para bloques de carga
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-slate-200/80 animate-pulse rounded-lg ${className}`} />
);

// Skeleton específico para Tarjetas de Resumen / Módulos
export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonBlock className="w-1/3 h-5" />
      <SkeletonBlock className="w-10 h-10 rounded-full" />
    </div>
    <SkeletonBlock className="w-2/3 h-8" />
    <SkeletonBlock className="w-1/2 h-4" />
  </div>
);

// Skeleton para Filas de Tablas (Pacientes, Citas, Usuarios)
export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr className="border-b border-slate-100 animate-pulse">
    {Array.from({ length: columns }).map((_, idx) => (
      <td key={idx} className="p-4">
        <SkeletonBlock className="h-4 w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

// Skeleton completo para la Agenda de Citas / Consultas del Odontopediatra
export const DoctorAgendaSkeleton = () => (
  <div className="space-y-4">
    {/* Header Skeleton */}
    <div className="p-6 bg-slate-100 rounded-2xl animate-pulse flex justify-between items-center h-28">
      <div className="space-y-2 w-1/2">
        <SkeletonBlock className="h-6 w-3/4 bg-slate-300" />
        <SkeletonBlock className="h-4 w-1/2 bg-slate-300" />
      </div>
      <SkeletonBlock className="h-12 w-28 rounded-xl bg-slate-300" />
    </div>

    {/* Lista de Citas Skeleton */}
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border-b border-slate-100">
          <div className="flex items-center gap-4 w-full md:w-2/3">
            <SkeletonBlock className="w-16 h-10 rounded-xl" />
            <div className="space-y-2 w-full">
              <SkeletonBlock className="h-5 w-1/3" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          </div>
          <SkeletonBlock className="w-full md:w-36 h-9 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonBlock;