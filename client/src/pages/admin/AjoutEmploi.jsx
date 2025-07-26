import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AjoutEmploi() {
  const [data, setData] = useState({ jour_semaine: '', heure: '', classe: '', matiere: '', enseignant: '' });
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [resC, resM, resE] = await Promise.all([
          api.get('/api/classes'),
          api.get('/api/matieres'),
          api.get('/api/enseignants'),
        ]);
        setClasses(resC.data);
        setMatieres(resM.data);
        setEnseignants(resE.data);
      } catch {
        setMessage({ type: 'error', text: 'Erreur chargement des données.' });
      }
    };
    fetch();
  }, []);

const handleSubmit = async () => {
  const { jour_semaine, heure, classe, matiere, enseignant } = data;

  // Validation simple
  if (!jour_semaine || !heure || !classe || !matiere || !enseignant) {
    return setMessage({ type: 'warning', text: 'Tous les champs sont requis.' });
  }

  // Vérifier le format heure "HH:mm - HH:mm"
  const parts = heure.split('-').map(p => p.trim());
  if (parts.length !== 2) {
    return setMessage({ type: 'warning', text: "Format d'heure invalide. Ex: '08:00 - 10:00'" });
  }

  try {
    // Optionnel : envoyer les heures séparées si backend l'exige
    const payload = {
      ...data,
      heure_debut: parts[0],
      heure_fin: parts[1],
    };

    console.log('Payload envoyé:', payload);

    await api.post('/api/emploi', payload);

    setMessage({ type: 'success', text: 'Créneau ajouté avec succès.' });
    setData({ jour_semaine: '', heure: '', classe: '', matiere: '', enseignant: '' });
  } catch (err) {
    setMessage({
      type: 'error',
      text: err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'ajout.',
    });
  }
};


  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-md mt-10 space-y-4">
      <h2 className="text-xl font-bold text-center">Ajouter un créneau</h2>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : message.type === 'warning' ? 'alert-warning' : 'alert-error'} shadow-sm`}>
          <span>{message.text}</span>
        </div>
      )}

      <select
        className="select select-bordered w-full"
        value={data.jour_semaine}
        onChange={(e) => setData({ ...data, jour_semaine: e.target.value })}
      >
        <option value="">Sélectionner un jour</option>
        {['Lundi','Mardi','Mercredi','Jeudi','Vendredi'].map(j => (
          <option key={j} value={j}>{j}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Heure (ex: 08:00 - 09:00)"
        className="input input-bordered w-full"
        value={data.heure}
        onChange={(e) => setData({ ...data, heure: e.target.value })}
      />

      <select
        className="select select-bordered w-full"
        value={data.classe}
        onChange={(e) => setData({ ...data, classe: e.target.value })}
      >
        <option value="">Sélectionner une classe</option>
        {classes.map(c => (
          <option key={c._id} value={c._id}>
            {c.nom} ({c.niveau})
          </option>
        ))}
      </select>

      <select
        className="select select-bordered w-full"
        value={data.matiere}
        onChange={(e) => setData({ ...data, matiere: e.target.value })}
      >
        <option value="">Sélectionner une matière</option>
        {matieres.map(m => (
          <option key={m._id} value={m._id}>
            {m.nom}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered w-full"
        value={data.enseignant}
        onChange={(e) => setData({ ...data, enseignant: e.target.value })}
      >
        <option value="">Sélectionner un enseignant</option>
        {enseignants.map(e => (
          <option key={e._id} value={e._id}>
            {e.nom}
          </option>
        ))}
      </select>

      <button
        className="btn btn-primary w-full mt-4"
        onClick={handleSubmit}
      >
        Ajouter le créneau
      </button>
    </div>
  );
}
