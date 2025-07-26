import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function AnalyseNotes() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/notes/analyse');
        setStats(res.data);
      } catch {
        setError("Erreur lors du chargement des statistiques");
      }
    };

    fetchStats();
  }, []);

  const getNiveau = (classeNom) => {
    if (!classeNom) return "Autres";
    const match = classeNom.match(/^\d+ème/);
    return match ? match[0] : "Autres";
  };

  const groupedStats = stats.reduce((acc, stat) => {
    const niveau = getNiveau(stat._id.classe);
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(stat);
    return acc;
  }, {});

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Analyse des Notes</h2>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {Object.entries(groupedStats).map(([niveau, statsNiveau]) => (
        <section key={niveau} className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">{niveau}</h3>

          {/* Desktop: tableau */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full bg-white rounded shadow">
              <thead className="bg-base-200 text-base-content">
                <tr>
                  <th>Classe</th>
                  <th>Semestre</th>
                  <th>Moyenne</th>
                  <th>Total de notes</th>
                </tr>
              </thead>
              <tbody>
                {statsNiveau.map((stat) => (
                  <tr key={`${stat._id.classe}-${stat._id.semestre}`}>
                    <td>{stat._id.classe}</td>
                    <td>{stat._id.semestre}</td>
                    <td>
                      <strong>{stat.moyenne.toFixed(2)}</strong>
                    </td>
                    <td>{stat.totalNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cartes */}
          <div className="md:hidden space-y-4">
            {statsNiveau.map(stat => (
              <div
                key={`${stat._id.classe}-${stat._id.semestre}`}
                className="bg-white rounded-lg shadow-md p-4 border border-base-200"
              >
                <p><span className="font-semibold">Classe :</span> {stat._id.classe}</p>
                <p><span className="font-semibold">Semestre :</span> {stat._id.semestre}</p>
                <p><span className="font-semibold">Moyenne :</span> {stat.moyenne.toFixed(2)}</p>
                <p><span className="font-semibold">Total de notes :</span> {stat.totalNotes}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
