import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function MatiereList() {
  const [matieres, setMatieres] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null); // ID à supprimer
  const [showModal, setShowModal] = useState(false);
  const perPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/matieres').then((res) => setMatieres(res.data));
  }, []);

  const filtered = matieres.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    api.delete(`/api/matieres/${selectedId}`).then(() =>
      api.get('/api/matieres').then((res) => {
        setMatieres(res.data);
        setShowModal(false);
      })
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">📘 Liste des Matières</h2>
        <div className="flex items-center gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <FaSearch />
            <input
              type="text"
              className="grow"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <button
            onClick={() => navigate('/admin/matieres/new')}
            className="btn btn-success btn-sm"
          >
            <FaPlus className="mr-1" />
          </button>
        </div>
      </div>
{/* Tableau pour desktop */}
<div className="hidden md:block overflow-x-auto">
  <table className="table table-zebra">
    <thead className="bg-base-200">
      <tr>
        <th>Nom</th>
        <th>Coefficient</th>
        <th>Classe</th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginated.map((m) => (
        <tr key={m._id}>
          <td>{m.nom}</td>
          <td>{m.coefficient}</td>
          <td>{m.classe?.nom}</td>
          <td className="text-center space-x-2">
            <button
              onClick={() => navigate(`/admin/matieres/edit/${m._id}`)}
              className="btn btn-sm btn-info text-white"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => confirmDelete(m._id)}
              className="btn btn-sm btn-error text-white"
            >
              <FaTrash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Cartes pour mobile */}
<div className="block md:hidden space-y-4">
  {paginated.map((m) => (
    <div key={m._id} className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-4 text-sm">
        <h3 className="card-title text-base text-primary">Nom: {m.nom}</h3>
        <p><span className="font-semibold">Coefficient :</span> {m.coefficient}</p>
        <p><span className="font-semibold">Classe :</span> {m.classe?.nom}</p>
        <div className="card-actions justify-end mt-3">
          <button
            onClick={() => navigate(`/admin/matieres/edit/${m._id}`)}
            className="btn btn-sm btn-info text-white"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => confirmDelete(m._id)}
            className="btn btn-sm btn-error text-white"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="btn btn-sm"
        >
          <FaArrowLeft /> Précédent
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page * perPage >= filtered.length}
          className="btn btn-sm"
        >
          Suivant <FaArrowRight />
        </button>
      </div>

      {/* Modal de confirmation */}
      {showModal && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">❌ Confirmation</h3>
            <p className="py-4">Voulez-vous vraiment supprimer cette matière ?</p>
            <div className="modal-action">
              <button onClick={() => setShowModal(false)} className="btn">
                Annuler
              </button>
              <button onClick={handleDelete} className="btn btn-error text-white">
                Supprimer
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
