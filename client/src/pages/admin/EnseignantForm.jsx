import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { FaSave, FaPlus, FaArrowLeft } from "react-icons/fa";

export default function EnseignantListe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    classe: '',
    matiere: ''
  });

  const [allMatieres, setAllMatieres] = useState([]);
  const [matiereIds, setMatiereIds] = useState([]);
  const [groupedMatieres, setGroupedMatieres] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMatieres();
        setAllMatieres(res.data || []);

        // Groupement par spécialité
        const grouped = res.data.reduce((acc, classe) => {
          const key = classe.niveau || "Autres";
          acc[key] = acc[key] || [];
          acc[key].push(classe);
          return acc;
        }, {});
        setGroupedMatieres(grouped);

        if (isEditing) {
          const teacherRes = await api.get(`/api/enseignants/${id}`);
          setFormData(teacherRes.data);
        }
      } catch (err) {
        console.error('Erreur de chargement :', err);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMatiereChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => parseInt(o.value));
    setMatiereIds(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      enseignant: isEditing ? id : undefined,
      matiere: matiere
    };

    try {
      const action = isEditing
        ? await api.put(`/api/enseignants/${id}`, formData)
        : await api.post('/api/enseignants',formData);

         action;

      navigate("/admin/teachers");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">
          {isEditing ? '✏️ Modifier un enseignant' : '➕ Ajouter un enseignant'}
        </h2>
        <button
          onClick={() => navigate('/admin/teachers')}
          className="text-gray-600 hover:text-blue-700 flex items-center gap-2"
        >
          <FaArrowLeft />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Nom', name: 'nom' },
          { label: 'Prénom', name: 'prenom' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Classe', name: 'classe' },
          { label: 'Matiere', name: 'matiere' }
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label htmlFor={name} className="block font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-500 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label htmlFor="date_recrutement" className="block font-medium text-gray-700">Classe</label>
          <select
            name="classe"
            value={formData.classe}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 px-4 py-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          > 
		   {}
		  </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Matières enseignées</label>
          <select
            multiple
            value={matiereIds}
            onChange={handleMatiereChange}
            className="w-full h-40 border border-gray-500 px-4 py-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(groupedMatieres).map(([specialite, matieres]) => (
              <optgroup key={specialite} label={specialite}>
                {matieres.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-white font-semibold transition duration-200 ${
            isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isEditing ? <FaSave /> : <FaPlus />}
          {isEditing ? "Enregistrer" : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
