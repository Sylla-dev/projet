import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function AdminEmploiManager() {
  const [creneaux, setCreneaux] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [form, setForm] = useState({});

  const fetchAll = async () => {
    try {
      const [c, e, m, emploi] = await Promise.all([
        api.get('/api/classes'),
        api.get('/api/enseignants'),
        api.get('/api/matieres'),
        api.get('/api/emploi'),
      ]);
      setClasses(c.data);
      setEnseignants(e.data);
      setMatieres(m.data);
      setCreneaux(emploi.data);
    } catch {
      toast.error("Erreur lors du chargement");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Emploi du temps', 14, 22);
    autoTable(doc, {
      startY: 30,
      head: [['Jour', 'Heure', 'Classe', 'Matière', 'Enseignant', 'Salle']],
      body: creneaux.map(c => [
        c.jour_semaine,
        `${c.heure_debut} - ${c.heure_fin}`,
        c.classe?.nom || '',
        c.matiere?.nom || '',
        c.enseignant?.nom || '',
        c.salle,
      ]),
    });
    doc.save('emploi-du-temps.pdf');
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    try {
      if (form._id) {
        await api.put(`/api/emploi/${form._id}`, form);
        toast.success("Modifié !");
      } else {
        await api.post('/api/emploi', form);
        toast.success("Ajouté !");
      }
      setForm({});
      fetchAll();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce créneau ?")) return;
    try {
      await api.delete(`/api/emploi/${id}`);
      toast.success("Supprimé");
      fetchAll();
    } catch {
      toast.error("Erreur de suppression");
    }
  };

  const getNiveau = (classeNom) => {
    if (!classeNom) return "Autres";
    const match = classeNom.match(/^\d+ème/);
    return match ? match[0] : "Autres";
  };

  const groupes = creneaux.reduce((acc, c) => {
    const niveau = getNiveau(c.classe?.nom);
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(c);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Gérer l'emploi du temps</h2>

      {/* Formulaire */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <select className="select select-bordered w-full" value={form.classe || ''} onChange={e => handleChange('classe', e.target.value)}>
          <option disabled value="">Sélectionner une classe</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.nom}</option>)}
        </select>

        <select className="select select-bordered w-full" value={form.matiere || ''} onChange={e => handleChange('matiere', e.target.value)}>
          <option disabled value="">Sélectionner une matière</option>
          {matieres.map(m => <option key={m._id} value={m._id}>{m.nom}</option>)}
        </select>

        <select className="select select-bordered w-full" value={form.enseignant || ''} onChange={e => handleChange('enseignant', e.target.value)}>
          <option disabled value="">Sélectionner un enseignant</option>
          {enseignants.map(e => <option key={e._id} value={e._id}>{e.nom} {e.prenom}</option>)}
        </select>

        <select className="select select-bordered w-full" value={form.jour_semaine || ''} onChange={e => handleChange('jour_semaine', e.target.value)}>
          <option disabled value="">Jour de la semaine</option>
          {jours.map(j => <option key={j} value={j}>{j}</option>)}
        </select>

        <input className="input input-bordered w-full" placeholder="Début (ex: 08:00)" value={form.heure_debut || ''} onChange={e => handleChange('heure_debut', e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Fin (ex: 10:00)" value={form.heure_fin || ''} onChange={e => handleChange('heure_fin', e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Salle" value={form.salle || ''} onChange={e => handleChange('salle', e.target.value)} />

        <button onClick={handleSubmit} className="btn btn-primary w-full">
          {form._id ? "Modifier" : "Ajouter"}
        </button>
      </div>

      <div className="flex justify-end">
        <button onClick={exportPDF} className="btn btn-outline btn-accent">
          📄 Exporter PDF
        </button>
      </div>

      {/* Groupes */}
      <div className="space-y-8">
        {Object.entries(groupes).map(([niveau, creneauxNiveau]) => (
          <div key={niveau}>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">{niveau}</h3>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Classe</th>
                    <th>Jour</th>
                    <th>Heures</th>
                    <th>Matière</th>
                    <th>Enseignant</th>
                    <th>Salle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creneauxNiveau.map(c => (
                    <tr key={c._id}>
                      <td>{c.classe?.nom}</td>
                      <td>{c.jour_semaine}</td>
                      <td>{c.heure_debut} - {c.heure_fin}</td>
                      <td>{c.matiere?.nom}</td>
                      <td>{c.enseignant?.nom} {c.enseignant?.prenom}</td>
                      <td>{c.salle}</td>
                      <td className="flex gap-2">
                        <button className="btn btn-xs btn-info" onClick={() => setForm(c)}>Modifier</button>
                        <button className="btn btn-xs btn-error" onClick={() => handleDelete(c._id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {creneauxNiveau.map(c => (
                <div key={c._id} className="card border border-base-300 shadow-sm p-4">
                  <h4 className="font-bold text-lg">{c.classe?.nom}</h4>
                  <p><b>Jour :</b> {c.jour_semaine}</p>
                  <p><b>Heures :</b> {c.heure_debut} - {c.heure_fin}</p>
                  <p><b>Matière :</b> {c.matiere?.nom}</p>
                  <p><b>Enseignant :</b> {c.enseignant?.nom}</p>
                  <p><b>Salle :</b> {c.salle}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="btn btn-sm btn-info w-full" onClick={() => setForm(c)}>Modifier</button>
                    <button className="btn btn-sm btn-error w-full" onClick={() => handleDelete(c._id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
