import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function ListeCoursEleve() {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const res = await api.get('/api/cours');
        setCours(res.data);
      } catch (err) {
        console.error('Erreur chargement cours', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCours();
  }, []);

  // Regroupement des cours par niveau
  const coursByNiveau = {};
  cours.forEach((c) => {
    const niveau = c.classe?.niveau || 'Niveau inconnu';
    if (!coursByNiveau[niveau]) coursByNiveau[niveau] = [];
    coursByNiveau[niveau].push(c);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (cours.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center text-gray-500">
          <p className="text-lg">Aucun cours disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cours disponibles</h2>

      <div className="join join-vertical w-full">
        {Object.entries(coursByNiveau)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([niveau, coursDuNiveau]) => (
            <div key={niveau} className="collapse collapse-arrow join-item border border-base-300 bg-base-100">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Niveau : {niveau}
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {coursDuNiveau.map((c) => (
                    <div
                      key={c._id}
                      className="card bg-base-200 shadow-md border border-base-300"
                    >
                      <div className="card-body">
                        <h3 className="card-title">{c.titre}</h3>
                        <p><span className="font-semibold">Matière :</span> {c.matiere?.nom || 'N/A'}</p>
                        <p><span className="font-semibold">Enseignant :</span> {c.enseignant?.nom || 'N/A'}</p>
                        {c.contenu && (
                          <p className="text-sm text-gray-700 mt-2">{c.contenu}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
