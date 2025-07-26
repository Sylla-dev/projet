import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function ListeNotesEleve() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/api/notes');
        setNotes(res.data);
      } catch (err) {
        alert('Erreur lors du chargement des notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Aucune note disponible
      </div>
    );
  }

  // Regroupement des notes par niveau
  const notesByNiveau = {};
  notes.forEach(note => {
    const niveau = note.classe?.niveau || 'Niveau inconnu';
    if (!notesByNiveau[niveau]) notesByNiveau[niveau] = [];
    notesByNiveau[niveau].push(note);
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Mes Notes</h2>

      {Object.entries(notesByNiveau)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([niveau, notesDuNiveau]) => (
          <div key={niveau} className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              Niveau : {niveau}
            </div>
            <div className="collapse-content overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th className="text-center">Note</th>
                    <th>Type</th>
                    <th>Enseignant</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {notesDuNiveau.map(note => (
                    <tr key={note._id}>
                      <td>{note.matiere?.nom || 'N/A'}</td>
                      <td className="font-semibold text-center">{note.valeur}/20</td>
                      <td>
                        <span className="badge badge-info">{note.type}</span>
                      </td>
                      <td>{note.enseignant?.nom || 'N/A'}</td>
                      <td>{new Date(note.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
}
