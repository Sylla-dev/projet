import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useParams } from 'react-router-dom';

export default function PresenceCours() {
  const { coursId } = useParams();
  const [eleves, setEleves] = useState([]);
  const [classe, setClasse] = useState(null);
  const [presences, setPresences] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState(new Set());

  useEffect(() => {
    if (!coursId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
		console.log('Cours ID reçu depuis params :', coursId);
        const { data: coursData } = await api.get(`/api/cours/${coursId}`);
        setClasse(coursData.classe);

        const { data: elevesData } = await api.get(`/api/eleves`);
        setEleves(elevesData);

        const { data: presencesData } = await api.get(`/api/presences?coursId=${coursId}`);
        const presMap = {};
        presencesData.forEach((p) => {
          if (p.eleve) {
            presMap[p.eleve._id] = p.status === 'présent';
          }
        });
        setPresences(presMap);
      } catch (error) {
        alert("Erreur lors du chargement des données");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coursId]);

  const togglePresence = async (eleveId) => {
    const current = presences[eleveId] || false;
    setSavingIds((prev) => new Set(prev).add(eleveId));

    try {
      await api.post('/api/presences', {
        eleveId,
        coursId,
        present: !current,
      });

      setPresences((prev) => ({ ...prev, [eleveId]: !current }));
    } catch (error) {
      alert("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eleveId);
        return newSet;
      });
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        📋 Présences - Cours {coursId} {classe?.nom && `| Classe: ${classe.nom}`}
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto border border-base-300 rounded-lg shadow">
            <table className="table w-full">
              <thead className="bg-base-200 text-base-content">
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Présence</th>
                </tr>
              </thead>
              <tbody>
                {eleves.map((eleve) => {
                  const present = presences[eleve._id] || false;
                  const isSaving = savingIds.has(eleve._id);

                  return (
                    <tr key={eleve._id} className="hover">
                      <td>{eleve.nom}</td>
                      <td>{eleve.prenom}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${present ? 'btn-success' : 'btn-outline btn-error'} ${isSaving ? 'loading' : ''}`}
                          onClick={() => togglePresence(eleve._id)}
                          disabled={isSaving}
                        >
                          {present ? 'Présent' : 'Absent'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 mt-4">
            {eleves.map((eleve) => {
              const present = presences[eleve._id] || false;
              const isSaving = savingIds.has(eleve._id);

              return (
                <div
                  key={eleve._id}
                  className="card border border-base-300 bg-base-100 shadow p-4"
                >
                  <p><strong>Nom :</strong> {eleve.nom}</p>
                  <p><strong>Prénom :</strong> {eleve.prenom}</p>
                  <button
                    className={`btn btn-sm mt-3 ${present ? 'btn-success' : 'btn-outline btn-error'} w-full ${isSaving ? 'loading' : ''}`}
                    onClick={() => togglePresence(eleve._id)}
                    disabled={isSaving}
                  >
                    {present ? 'Présent' : 'Absent'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
