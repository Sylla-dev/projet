import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function AjoutCours() {
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    titre: '',
    contenu: '',
    classe: '',
    matiere: '',
    enseignant: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClasses, resMatieres, resEns] = await Promise.all([
          api.get('/api/classes'),
          api.get('/api/matieres'),
          api.get('/api/enseignants')
        ]);
        setClasses(resClasses.data);
        setMatieres(resMatieres.data);
        setEnseignants(resEns.data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { titre, contenu, classe, matiere, enseignant } = form;
    if (!titre || !contenu || !classe || !matiere || !enseignant) {
      setMessage({ type: 'warning', text: 'Tous les champs sont obligatoires' });
      return;
    }

    try {
      await api.post('/api/cours', form);
      setMessage({ type: 'success', text: 'Cours ajouté avec succès' });
      setForm({ titre: '', contenu: '', classe: '', matiere: '', enseignant: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'ajout du cours' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow rounded-lg space-y-5">
      <h2 className="text-2xl font-bold mb-2">➕ Ajouter un Cours</h2>

      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : message.type === 'success' ? 'alert-success' : 'alert-warning'} shadow-sm`}>
          <span>{message.text}</span>
        </div>
      )}

      <input
        type="text"
        placeholder="Titre du cours"
        className="input input-bordered w-full"
        value={form.titre}
        onChange={(e) => handleChange('titre', e.target.value)}
      />

      <textarea
        placeholder="Contenu ou résumé du cours"
        className="textarea textarea-bordered w-full"
        rows={5}
        value={form.contenu}
        onChange={(e) => handleChange('contenu', e.target.value)}
      ></textarea>

      <select
        className="select select-bordered w-full"
        value={form.matiere}
        onChange={(e) => handleChange('matiere', e.target.value)}
      >
        <option value="">Sélectionner une matière</option>
        {matieres.map((m) => (
          <option key={m._id} value={m._id}>{m.nom}</option>
        ))}
      </select>

      <select
        className="select select-bordered w-full"
        value={form.classe}
        onChange={(e) => handleChange('classe', e.target.value)}
      >
        <option value="">Sélectionner une classe</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.nom} ({c.niveau})
          </option>
        ))}
      </select>

      <select
        className="select select-bordered w-full"
        value={form.enseignant}
        onChange={(e) => handleChange('enseignant', e.target.value)}
      >
        <option value="">Sélectionner un enseignant</option>
        {enseignants.map((e) => (
          <option key={e._id} value={e._id}>{e.nom} {e.prenom}</option>
        ))}
      </select>

      <button className="btn btn-primary w-full" onClick={handleSubmit}>
        Enregistrer le cours
      </button>
    </div>
  );
}
