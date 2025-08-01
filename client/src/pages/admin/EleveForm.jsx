import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function EleveForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    genre: 'Masculin',
    classe: '',
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await api.get('/api/classes');
        setClasses(classRes.data);

        if (isEditing) {
          const eleveRes = await api.get(`/api/eleves/${id}`);
          setForm({
            ...eleveRes.data,
            dateNaissance: eleveRes.data.dateNaissance?.split('T')[0],
          });
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const action = isEditing ? api.put(`/api/eleves/${id}`, form) : api.post('/api/eleves',form);
      await action;
      setSuccess(true);
      setTimeout(() => navigate('/admin/eleves'), 1000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la soumission du formulaire.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 animate-pulse">Chargement des données...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-base-100 rounded-lg shadow-lg border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {isEditing ? 'Modifier un élève' : 'Ajouter un élève'}
        </h2>
        <button
          onClick={() => navigate('/admin/eleves')}
          className="btn btn-ghost btn-sm gap-2 flex items-center normal-case"
        >
          <FaArrowLeft />
        </button>
      </div>

      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div className="alert alert-success shadow-lg mb-4">
          <div>Opération réussie !</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Matricule */}
        <input
          type="text"
          name="matricule"
          value={form.matricule}
          onChange={handleChange}
          placeholder="Matricule"
          required
          className="input input-bordered w-full"
        />

        {/* Nom & Prénom */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom"
            required
            className="input input-bordered flex-1"
          />
          <input
            type="text"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            required
            className="input input-bordered flex-1"
          />
        </div>

        {/* Date de naissance */}
        <input
          type="date"
          name="dateNaissance"
          value={form.dateNaissance}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />

        {/* Sexe */}
        <select
          name="genre"
          value={form.genre}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="Masculin">Masculin</option>
          <option value="Féminin">Féminin</option>
        </select>

        {/* Classe */}
        <select
          name="classe"
          value={form.classe}
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">-- Choisir une classe --</option>
          {classes.map((classe) => (
            <option key={classe._id} value={classe._id}>
              {classe.nom} ({classe.niveau})
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`btn btn-success w-full ${submitting ? 'loading' : ''}`}
        >
          {submitting
            ? isEditing
              ? 'Mise à jour en cours...'
              : 'Ajout en cours...'
            : isEditing
            ? 'Mettre à jour'
            : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}
