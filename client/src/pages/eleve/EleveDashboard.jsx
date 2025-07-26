import React from 'react';

export default function EleveDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-primary">Tableau de bord Élève</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Carte Nombre d'élèves */}
        <div className="card bg-base-100 shadow-md border border-primary">
          <div className="card-body">
            <h2 className="card-title text-primary">Nombre d'élèves</h2>
            <p className="text-4xl font-extrabold">128</p>
            <p className="text-sm text-gray-500">Total des élèves inscrits</p>
          </div>
        </div>

        {/* Carte Classes */}
        <div className="card bg-base-100 shadow-md border border-primary">
          <div className="card-body">
            <h2 className="card-title text-primary">Classes</h2>
            <p className="text-4xl font-extrabold">12</p>
            <p className="text-sm text-gray-500">Nombre de classes disponibles</p>
          </div>
        </div>

        {/* Carte Élèves présents aujourd'hui */}
        <div className="card bg-base-100 shadow-md border border-primary">
          <div className="card-body">
            <h2 className="card-title text-primary">Présents aujourd'hui</h2>
            <p className="text-4xl font-extrabold">115</p>
            <p className="text-sm text-gray-500">Élèves présents en cours</p>
          </div>
        </div>

        {/* Carte Prochains examens */}
        <div className="card bg-base-100 shadow-md border border-primary">
          <div className="card-body">
            <h2 className="card-title text-primary">Prochains examens</h2>
            <p className="text-4xl font-extrabold">3</p>
            <p className="text-sm text-gray-500">Examens planifiés cette semaine</p>
          </div>
        </div>
      </div>
    </div>
  );
}
