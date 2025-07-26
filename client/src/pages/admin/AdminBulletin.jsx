import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Edit, Trash, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminBulletins() {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingBulletin, setEditingBulletin] = useState(null);
  const [updatedNotes, setUpdatedNotes] = useState([]);
  const [appreciation, setAppreciation] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBulletins();
  }, []);

  const fetchBulletins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/bulletins');
      setBulletins(res.data);
    } catch (err) {
      alert("Erreur lors du chargement des bulletins.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (bulletin) => {
    setEditingBulletin(bulletin);
    setUpdatedNotes(bulletin.notes.map(n => ({ ...n })));
    setAppreciation(bulletin.appreciation || '');
    setShowModal(true);
  };

  const handleNoteChange = (index, value) => {
    const newNotes = [...updatedNotes];
    newNotes[index].moyenne = value;
    setUpdatedNotes(newNotes);
  };

  const updateBulletin = async () => {
    try {
      const payload = {
        notes: updatedNotes.map(n => ({
          matiere: n.matiere?._id || n.matiere,
          moyenne: parseFloat(n.moyenne),
        })),
        appreciation,
      };
      await api.put(`/api/bulletins/${editingBulletin._id}`, payload);
      alert('Bulletin mis à jour !');
      setShowModal(false);
      fetchBulletins();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce bulletin ?')) return;
    try {
      await api.delete(`/api/bulletins/${id}`);
      fetchBulletins();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const bulletinsParNiveau = bulletins.reduce((acc, b) => {
    const niveau = b.classe?.niveau || 'Inconnu';
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(b);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Gestion des Bulletins</h2>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        Object.entries(bulletinsParNiveau).map(([niveau, items]) => (
          <div key={niveau} className="mb-10">
            <h3 className="text-lg font-semibold text-primary mb-4">Niveau : {niveau}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((b) => (
                <div
                  key={b._id}
                  className="card bg-base-100 shadow-md border"
                >
                  <div className="card-body text-sm">
                    <p><span className="font-semibold">Élève :</span> {b.eleve?.nom}</p>
                    <p><span className="font-semibold">Classe :</span> {b.classe?.nom}</p>
                    <p><span className="font-semibold">Semestre :</span> {b.semestre}</p>
                    <p><span className="font-semibold">Moyenne :</span> {b.moyenneGenerale.toFixed(2)}</p>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      <button
                        onClick={() => openEditModal(b)}
                        className="btn btn-sm btn-primary"
                      >
                        <Edit size={16} className="mr-1" /> Modifier
                      </button>
                      <button
                        onClick={() => supprimer(b._id)}
                        className="btn btn-sm btn-error"
                      >
                        <Trash size={16} className="mr-1" /> Supprimer
                      </button>
                      <Link to={`/admin/bulletins/${b._id}`} className="btn btn-sm btn-info">
                        <Eye size={16} className="mr-1" /> Voir
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* 🟢 Modal DaisyUI */}
      {showModal && (
        <dialog id="editModal" className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-lg mb-4">Modifier le Bulletin</h3>

            {editingBulletin && (
              <div className="space-y-3">
                {updatedNotes.map((note, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-1/2 truncate">{note.matiere?.nom || ''}</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={note.moyenne}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      className="input input-sm input-bordered w-24"
                    />
                  </div>
                ))}

                <textarea
                  className="textarea textarea-bordered w-full mt-4"
                  rows={3}
                  placeholder="Appréciation"
                  value={appreciation}
                  onChange={(e) => setAppreciation(e.target.value)}
                ></textarea>

                <div className="modal-action">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-ghost"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={updateBulletin}
                    className="btn btn-primary"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
