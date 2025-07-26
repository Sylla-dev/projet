import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import dayjs from 'dayjs';

export default function Semestres() {
  const [semestres, setSemestres] = useState([]);
  const [form, setForm] = useState({ nom: '', dateDebut: '', dateFin: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  const fetchSemestres = async () => {
    try {
      const res = await api.get('/api/semestres');
      setSemestres(res.data || []);
    } catch {
      alert('Erreur lors du chargement des semestres');
    }
  };

  useEffect(() => {
    fetchSemestres();
  }, []);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleEditChange = (field, value) =>
    setEditingForm((prev) => ({ ...prev, [field]: value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/semestres', form);
      setForm({ nom: '', dateDebut: '', dateFin: '' });
      fetchSemestres();
    } catch {
      alert('Erreur lors de la création');
    }
  };

  const startEdit = (semestre) => {
    setEditingId(semestre._id);
    setEditingForm({
      nom: semestre.nom,
      dateDebut: dayjs(semestre.dateDebut).format('YYYY-MM-DD'),
      dateFin: dayjs(semestre.dateFin).format('YYYY-MM-DD'),
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleSaveEdit = async (id) => {
    try {
      await api.put(`/api/semestres/${id}`, editingForm);
      setEditingId(null);
      fetchSemestres();
    } catch {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce semestre ?')) {
      try {
        await api.delete(`/api/semestres/${id}`);
        fetchSemestres();
      } catch {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primary">Gestion des semestres</h2>

      {/* Formulaire de création */}
      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <input
          type="text"
          placeholder="Nom (ex: Semestre 1)"
          className="input input-bordered w-full"
          value={form.nom}
          onChange={(e) => handleChange('nom', e.target.value)}
          required
        />
        <input
          type="date"
          className="input input-bordered w-full"
          value={form.dateDebut}
          onChange={(e) => handleChange('dateDebut', e.target.value)}
          required
        />
        <input
          type="date"
          className="input input-bordered w-full"
          value={form.dateFin}
          onChange={(e) => handleChange('dateFin', e.target.value)}
          required
        />
        <div className="md:col-span-3 flex justify-end">
          <button type="submit" className="btn btn-primary">Ajouter le semestre</button>
        </div>
      </form>

      {/* Vue desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {semestres.map((s) => (
              <tr key={s._id}>
                <td>
                  {editingId === s._id ? (
                    <input
                      type="text"
                      className="input input-sm input-bordered w-full"
                      value={editingForm.nom}
                      onChange={(e) => handleEditChange('nom', e.target.value)}
                    />
                  ) : s.nom}
                </td>
                <td>
                  {editingId === s._id ? (
                    <input
                      type="date"
                      className="input input-sm input-bordered w-full"
                      value={editingForm.dateDebut}
                      onChange={(e) => handleEditChange('dateDebut', e.target.value)}
                    />
                  ) : dayjs(s.dateDebut).format('YYYY-MM-DD')}
                </td>
                <td>
                  {editingId === s._id ? (
                    <input
                      type="date"
                      className="input input-sm input-bordered w-full"
                      value={editingForm.dateFin}
                      onChange={(e) => handleEditChange('dateFin', e.target.value)}
                    />
                  ) : dayjs(s.dateFin).format('YYYY-MM-DD')}
                </td>
                <td className="flex gap-2">
                  {editingId === s._id ? (
                    <>
                      <button onClick={() => handleSaveEdit(s._id)} className="btn btn-sm btn-success">Sauver</button>
                      <button onClick={cancelEdit} className="btn btn-sm">Annuler</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(s)} className="btn btn-sm btn-outline">Modifier</button>
                      <button onClick={() => handleDelete(s._id)} className="btn btn-sm btn-error">Supprimer</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {semestres.map((s) => (
          <div key={s._id} className="card border shadow-sm bg-base-100">
            <div className="card-body p-4 text-sm">
              {editingId === s._id ? (
                <>
                  <input
                    type="text"
                    className="input input-sm input-bordered mb-2"
                    value={editingForm.nom}
                    onChange={(e) => handleEditChange('nom', e.target.value)}
                  />
                  <input
                    type="date"
                    className="input input-sm input-bordered mb-2"
                    value={editingForm.dateDebut}
                    onChange={(e) => handleEditChange('dateDebut', e.target.value)}
                  />
                  <input
                    type="date"
                    className="input input-sm input-bordered mb-2"
                    value={editingForm.dateFin}
                    onChange={(e) => handleEditChange('dateFin', e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleSaveEdit(s._id)} className="btn btn-sm btn-success">Sauver</button>
                    <button onClick={cancelEdit} className="btn btn-sm">Annuler</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-primary text-base">{s.nom}</h3>
                  <p><span className="font-semibold">Début :</span> {dayjs(s.dateDebut).format('YYYY-MM-DD')}</p>
                  <p><span className="font-semibold">Fin :</span> {dayjs(s.dateFin).format('YYYY-MM-DD')}</p>
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => startEdit(s)} className="btn btn-xs btn-outline">Modifier</button>
                    <button onClick={() => handleDelete(s._id)} className="btn btn-xs btn-error">Supprimer</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {semestres.length === 0 && (
        <div className="text-center text-gray-500 mt-4">Aucun semestre trouvé</div>
      )}
    </div>
  );
}
