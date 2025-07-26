import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AjouterBulletin() {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classe, setClasse] = useState('');
  const [eleve, setEleve] = useState('');
  const [semestre, setSemestre] = useState('1');
  const [notes, setNotes] = useState([]);
  const [appreciation, setAppreciation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [elevesRes, classesRes, matieresRes] = await Promise.all([
          api.get('/api/eleves'),
          api.get('/api/classes'),
          api.get('/api/matieres'),
        ]);
        setEleves(elevesRes.data);
        setClasses(classesRes.data);
        setMatieres(matieresRes.data);
      } catch (err) {
        alert("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, []);

  const ajouterNote = () => {
    setNotes([...notes, { matiere: '', moyenne: '' }]);
  };

  const modifierNote = (index, field, value) => {
    const newNotes = [...notes];
    newNotes[index][field] = value;
    setNotes(newNotes);
  };

  const supprimerNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validNotes = notes.filter(n => n.matiere && n.moyenne !== '');
    if (!eleve || !classe || validNotes.length === 0) {
      return alert('Champs obligatoires manquants');
    }

    const payload = {
      eleve,
      classe,
      semestre,
      notes: validNotes.map(n => ({
        matiere: n.matiere,
        moyenne: parseFloat(n.moyenne),
      })),
      appreciation,
    };

    try {
      await api.post('/api/bulletins', payload);
      alert('Bulletin créé avec succès');
      setClasse('');
      setEleve('');
      setNotes([]);
      setAppreciation('');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Ajouter un Bulletin</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Sélection Classe & Élève */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="select select-bordered w-full"
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            required
          >
            <option value="">-- Sélectionner une classe --</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.nom}</option>
            ))}
          </select>

          <select
            className="select select-bordered w-full"
            value={eleve}
            onChange={(e) => setEleve(e.target.value)}
            required
          >
            <option value="">-- Sélectionner un élève --</option>
            {eleves.map(e => (
              <option key={e._id} value={e._id}>{e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>

        {/* Semestre */}
        <select
          className="select select-bordered w-full"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
        >
          <option value="1">Semestre 1</option>
          <option value="2">Semestre 2</option>
        </select>

        {/* Notes */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Notes</h3>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={ajouterNote}
            >
              + Ajouter une note
            </button>
          </div>

          {notes.map((note, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-3">
              <select
                className="select select-bordered w-full md:flex-1"
                value={note.matiere}
                onChange={(e) => modifierNote(index, 'matiere', e.target.value)}
              >
                <option value="">Matière</option>
                {matieres.map(m => (
                  <option key={m._id} value={m._id}>{m.nom}</option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                max="20"
                className="input input-bordered w-full md:w-24"
                placeholder="Note"
                value={note.moyenne}
                onChange={(e) => modifierNote(index, 'moyenne', e.target.value)}
              />

              <button
                type="button"
                onClick={() => supprimerNote(index)}
                className="btn btn-error btn-outline btn-sm"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* Appréciation */}
        <textarea
          className="textarea textarea-bordered w-full"
          rows="4"
          placeholder="Appréciation"
          value={appreciation}
          onChange={(e) => setAppreciation(e.target.value)}
        />

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full">
          Enregistrer le bulletin
        </button>
      </form>
    </div>
  );
}
