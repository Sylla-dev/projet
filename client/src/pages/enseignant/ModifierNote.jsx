import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function ModifierNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // Pour messages de succès/erreur

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/notes/${id}`);
        setNote(res.data);
      } catch {
        setMessage({ type: 'error', text: 'Erreur lors du chargement de la note' });
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note.valeur < 0 || note.valeur > 20) {
      setMessage({ type: 'error', text: 'La note doit être comprise entre 0 et 20' });
      return;
    }

    setSaving(true);
    try {
      await api.put(`/api/notes/${id}`, note);
      setMessage({ type: 'success', text: 'Note modifiée avec succès' });
      setTimeout(() => navigate('/enseignant/notes'), 1200);
    } catch {
      setMessage({ type: 'error', text: "Erreur lors de la modification" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !note) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h2 className="text-xl font-bold">Modifier la Note</h2>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Valeur */}
        <div>
          <label className="label font-semibold">Valeur de la note (0-20)</label>
          <input
            type="number"
            min={0}
            max={20}
            value={note.valeur}
            onChange={(e) => setNote({ ...note, valeur: Number(e.target.value) })}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Type de note */}
        <div>
          <label className="label font-semibold">Type de note</label>
          <select
            value={note.type}
            onChange={(e) => setNote({ ...note, type: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">-- Choisir --</option>
            <option value="Devoir">Devoir</option>
            <option value="Composition">Composition</option>
            <option value="Contrôle">Contrôle</option>
          </select>
        </div>

        {/* Semestre */}
        <div>
          <label className="label font-semibold">Semestre</label>
          <select
            value={note.semestre}
            onChange={(e) => setNote({ ...note, semestre: e.target.value })}
            className="select select-bordered w-full"
            required
          >
            <option value="">-- Choisir --</option>
            <option value="Semestre 1">Semestre 1</option>
            <option value="Semestre 2">Semestre 2</option>
          </select>
        </div>

        {/* Bouton */}
        <div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${saving ? 'btn-disabled' : ''}`}
          >
            {saving ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
