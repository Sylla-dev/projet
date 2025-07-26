import { useEffect, useState, useMemo } from 'react';
import { message } from 'antd';
import { api } from '../../services/api';

export default function EmploiEnseignant() {
  const [emploi, setEmploi] = useState([]);

  useEffect(() => {
    const fetchEmploi = async () => {
      try {
        const res = await api.get(`/api/emploi`);
        setEmploi(res.data);
      } catch (err) {
        message.error("Erreur lors du chargement de l'emploi du temps");
      }
    };
    fetchEmploi();
  }, []);

  const groupedByNiveau = useMemo(() => {
    return emploi.reduce((acc, creneau) => {
      const niveau = creneau.classe?.niveau || 'Inconnu';
      if (!acc[niveau]) acc[niveau] = [];
      acc[niveau].push(creneau);
      return acc;
    }, {});
  }, [emploi]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        📅 <span>Mon Emploi du Temps</span>
      </h2>

      {/* 🖥️ Version Desktop */}
      <div className="hidden md:block space-y-10">
        {Object.entries(groupedByNiveau).map(([niveau, creneaux]) => (
          <section key={niveau}>
            <h3 className="text-xl font-semibold mb-3">{niveau}</h3>
            <div className="overflow-x-auto rounded-xl border border-base-300 shadow">
              <table className="table w-full text-sm">
                <thead className="bg-base-200 text-base-content">
                  <tr>
                    <th>Jour</th>
                    <th>Heure</th>
                    <th>Classe</th>
                    <th>Matière</th>
                    <th>Salle</th>
                  </tr>
                </thead>
                <tbody>
                  {creneaux.map((c) => (
                    <tr key={c._id} className="hover">
                      <td>{c.jour_semaine}</td>
                      <td>{`${c.heure_debut} - ${c.heure_fin}`}</td>
                      <td>{c.classe?.nom || '-'}</td>
                      <td>{c.matiere?.nom || '-'}</td>
                      <td>{c.salle || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {/* 📱 Version Mobile */}
      <div className="md:hidden space-y-8">
        {Object.entries(groupedByNiveau).map(([niveau, creneaux]) => (
          <section key={niveau}>
            <h3 className="text-lg font-semibold mb-4">{niveau}</h3>
            <div className="space-y-4">
              {creneaux.map((c) => (
                <div
                  key={c._id}
                  className="card border border-base-300 bg-base-100 shadow p-4"
                >
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">📆 Jour :</span> {c.jour_semaine}</p>
                    <p><span className="font-semibold">⏰ Heure :</span> {c.heure_debut} - {c.heure_fin}</p>
                    <p><span className="font-semibold">🏫 Classe :</span> {c.classe?.nom || '-'}</p>
                    <p><span className="font-semibold">📘 Matière :</span> {c.matiere?.nom || '-'}</p>
                    <p><span className="font-semibold">🏠 Salle :</span> {c.salle || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
