import React from 'react';
import { 
    GraduationCap,
  BookOpenCheck,
  CalendarClock,
  ClipboardList
 } from 'lucide-react';

export default function EnseignantDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-primary">Tableau de bord enseignant</h1>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-md border">
          <div className="card-body items-start">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap size={20} />
              <h2 className="card-title text-base">Mes cours</h2>
            </div>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-gray-500">Cours programmés</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border">
          <div className="card-body items-start">
            <div className="flex items-center gap-2 text-primary">
              <ClipboardList size={20} />
              <h2 className="card-title text-base">Présences</h2>
            </div>
            <p className="text-2xl font-bold">95%</p>
            <p className="text-sm text-gray-500">Taux de présence</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border">
          <div className="card-body items-start">
            <div className="flex items-center gap-2 text-primary">
              <BookOpenCheck size={20} />
              <h2 className="card-title text-base">Évaluations</h2>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-500">Notes saisies</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border">
          <div className="card-body items-start">
            <div className="flex items-center gap-2 text-primary">
              <CalendarClock size={20} />
              <h2 className="card-title text-base">Prochains cours</h2>
            </div>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-gray-500">Aujourd'hui</p>
          </div>
        </div>
      </div>

      {/* Section de contenu futur */}
      <div className="mt-8">
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title">Bienvenue 👋</h2>
            <p>
              Utilisez ce tableau de bord pour consulter vos cours, marquer les présences,
              et suivre l'évolution de vos classes. Plus de fonctionnalités à venir !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
