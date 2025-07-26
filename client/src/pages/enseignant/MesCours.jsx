import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

export default function MesCours() {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchCours = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cours');
      setCours(res.data);
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des cours' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCours();
  }, []);

  const deleteCours = async (id) => {
    try {
      await api.delete(`/api/cours/${id}`);
      setMessage({ type: 'success', text: 'Cours supprimé avec succès' });
      fetchCours();
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du cours' });
    }
  };

  // Groupement par niveau
  const coursByNiveau = {};
  cours.forEach(c => {
    const niveau = c.classe?.niveau || 'Niveau inconnu';
    if (!coursByNiveau[niveau]) coursByNiveau[niveau] = [];
    coursByNiveau[niveau].push(c);
  });

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-3xl font-semibold text-center">📚 Mes Cours par Niveau</h2>

	  
	     <Link
          to='/admin/mescours/new'
          className='btn btn-primary gap-2 text-sm sm:text-base'
        >
          <FaPlus />
        </Link>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}>
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
      ) : cours.length === 0 ? (
        <div className="text-center text-gray-500">Aucun cours disponible</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(coursByNiveau)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([niveau, coursDuNiveau]) => (
              <div key={niveau} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                  Niveau : {niveau}
                </div>
                <div className="collapse-content">
                  {coursDuNiveau.map((cours) => (
                    <div key={cours._id} className="card bg-base-200 shadow-sm mb-4">
                      <div className="card-body p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">{cours.titre}</h3>
                            <p className="text-sm text-gray-600">
                              📘 {cours.matiere?.nom} — 🏫 {cours.classe?.nom} ({cours.classe?.niveau})
                            </p>
                            <p className="text-sm text-gray-500">📅 {new Date(cours.date).toLocaleDateString()}</p>
                          </div>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => deleteCours(cours._id)}
                          >
                            Supprimer
                          </button>

                          <Link to={`/cours/${cours._id}/presences`}>Gérer les présences</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
