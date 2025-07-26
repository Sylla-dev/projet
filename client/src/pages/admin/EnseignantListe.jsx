import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Input,
  Button,
  Table,
  Popconfirm,
  message,
  Select,
  Collapse,
  Empty,
} from 'antd';

const { Panel } = Collapse;

export default function EnseignantListe() {
  const [form, setForm] = useState({
    nom: '',
	  prenom: '',
    email: '',
    matieres: [],
    classes: [],
  });
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  useEffect(() => {
    fetchData();
    fetchMatieres();
    fetchClasses();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/enseignants');
      setEnseignants(res.data);
    } catch {
      message.error("Erreur lors de la récupération des enseignants");
    }
  };

  const fetchMatieres = async () => {
    try {
      const res = await api.get('/api/matieres');
      setMatieres(res.data);
    } catch {
      message.error("Erreur lors de la récupération des matières");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/api/classes');
      setClasses(res.data);
    } catch {
      message.error("Erreur lors de la récupération des classes");
    }
  };

  // Gestion formulaire création
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSelectChange = (field, val) => setForm({ ...form, [field]: val });

  // Gestion formulaire édition
  const handleEditChange = (e) =>
    setEditingForm({ ...editingForm, [e.target.name]: e.target.value });
  const handleEditSelectChange = (field, val) =>
    setEditingForm({ ...editingForm, [field]: val });

  // Création enseignant
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/enseignants', form);
      message.success('Enseignant ajouté');
      setForm({ nom: '', prenom: '', email: '', matieres: [], classes: [] });
      fetchData();
    } catch {
      message.error('Erreur lors de l\'ajout');
    }
  };

  // Édition
  const startEdit = (record) => {
    setEditingId(record._id);
    // On remplit editingForm avec les bonnes valeurs, on transforme les objets en ids pour Select
    setEditingForm({
      nom: record.nom || '',
	  prenom: record.prenom || '',
      email: record.email || '',
      matieres: record.matieres ? record.matieres.map(m => m._id) : [],
      classes: record.classes ? record.classes.map(c => c._id) : [],
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    try {
      await api.put(`/api/enseignants/${id}`, editingForm);
      message.success('Enseignant modifié');
      setEditingId(null);
      fetchData();
    } catch {
      message.error('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/enseignants/${id}`);
      message.success('Enseignant supprimé');
      fetchData();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  // Groupement des enseignants par niveau de classe
  // On crée un objet: { niveau: [enseignants] }
  const enseignantsByNiveau = {};
  enseignants.forEach((ens) => {
    // Pour chaque enseignant, on récupère les niveaux de ses classes (uniques)
    const niveaux = [...new Set(ens.classes.map(c => c.niveau))];
    niveaux.forEach(niveau => {
      if (!enseignantsByNiveau[niveau]) enseignantsByNiveau[niveau] = [];
      enseignantsByNiveau[niveau].push(ens);
    });
  });

  // Colonnes pour le tableau d'enseignants
  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      render: (_, record) =>
        editingId === record._id ? (
          <Input name="nom" value={editingForm.nom} onChange={handleEditChange} />
        ) : (
          record.nom
        ),
    },
    {
      title: 'Prenom',
      dataIndex: 'prenom',
      render: (_, record) =>
        editingId === record._id ? (
          <Input name="prenom" value={editingForm.prenom} onChange={handleEditChange} />
        ) : (
          record.prenom
        ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (_, record) =>
        editingId === record._id ? (
          <Input name="email" value={editingForm.email} onChange={handleEditChange} />
        ) : (
          record.email
        ),
    },
    {
      title: 'Matières',
      dataIndex: 'matieres',
      render: (matieres) => matieres.map((m) => m.nom).join(', '),
    },
    {
      title: 'Classes',
      dataIndex: 'classes',
      render: (classes) => classes.map((c) => `${c.nom} (${c.niveau})`).join(', '),
    },
    {
      title: 'Actions',
      render: (_, record) =>
        editingId === record._id ? (
          <>
            <Button onClick={() => saveEdit(record._id)} size="small" type="primary">
              Sauver
            </Button>{' '}
            <Button onClick={cancelEdit} size="small">
              Annuler
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => startEdit(record)} size="small">
              Modifier
            </Button>{' '}
            <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(record._id)}>
              <Button size="small" danger>
                Supprimer
              </Button>
            </Popconfirm>
          </>
        ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Gestion des enseignants</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
        <Input name="prenom" placeholder="Prenom" value={form.prenom} onChange={handleChange} required />
        <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

        <Select
          mode="multiple"
          allowClear
          placeholder="Matières"
          value={form.matieres}
          onChange={(val) => handleSelectChange('matieres', val)}
        >
          {matieres.map((m) => (
            <Select.Option key={m._id} value={m._id}>
              {m.nom}
            </Select.Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          allowClear
          placeholder="Classes"
          value={form.classes}
          onChange={(val) => handleSelectChange('classes', val)}
        >
          {classes.map((c) => (
            <Select.Option key={c._id} value={c._id}>
              {c.nom} ({c.niveau})
            </Select.Option>
          ))}
        </Select>

        <div className="md:col-span-6 flex justify-end">
          <Button type="primary" htmlType="submit">
            Ajouter
          </Button>
        </div>
      </form>

      {Object.keys(enseignantsByNiveau).length === 0 && <Empty description="Aucun enseignant trouvé" />}

<Collapse
  accordion
  items={Object.entries(enseignantsByNiveau)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([niveau, enseignantsDuNiveau]) => ({
      key: niveau,
      label: `Niveau : ${niveau}`,
      children: (
        <Table
          columns={columns}
          dataSource={enseignantsDuNiveau}
          rowKey="_id"
          pagination={false}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      ),
    }))}
></Collapse>

    </div>
  );
}
