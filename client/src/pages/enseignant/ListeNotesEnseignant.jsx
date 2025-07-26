import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function ListeNotesEnseignant() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/notes');
      setNotes(res.data);
    } catch {
      alert("Erreur lors du chargement des notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await api.delete(`/api/notes/${id}`);
        fetchNotes();
      } catch {
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
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

  // Regroupement par niveau
  const notesByNiveau = {};
  notes.forEach(note => {
    const niveau = note.classe?.niveau || 'Niveau inconnu';
    if (!notesByNiveau[niveau]) notesByNiveau[niveau] = [];
    notesByNiveau[niveau].push(note);
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liste des Notes par Niveau</h2>
        <Link to="/enseignant/notes/new" className="btn btn-primary btn-sm gap-2">
          <FaPlus /> Ajouter
        </Link>
      </div>

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
                    <th>Élève</th>
                    <th>Classe</th>
                    <th>Matière</th>
                    <th>Note</th>
                    <th>Type</th>
                    <th>Semestre</th>
                    <th>Enseignant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notesDuNiveau.map(note => (
                    <tr key={note._id}>
                      <td>{note.eleve?.nom || 'N/A'}</td>
                      <td>{note.classe?.nom || 'N/A'}</td>
                      <td>{note.matiere?.nom || 'N/A'}</td>
                      <td className="font-bold text-center">{note.valeur}/20</td>
                      <td>{note.type}</td>
                      <td>{note.semestre?.nom}</td>
                      <td>{note.enseignant?.nom || 'N/A'}</td>
                      <td className="flex gap-2">
                        <Link
                          to={`/enseignant/notes/edit/${note._id}`}
                          className="btn btn-xs btn-outline"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="btn btn-xs btn-error"
                        >
                          <FaTrash />
                        </button>
                      </td>
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
