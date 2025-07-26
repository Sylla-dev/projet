import React, { useEffect, useState } from 'react';
import { api } from "../../services/api";
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

export default function EleveList() {
  const [groupedEleves, setGroupedEleves] = useState({});
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const perPage = 5;
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/api/eleves');
      setGroupedEleves(res.data);

      // Init pagination per niveau
      const initialPagination = {};
      Object.keys(res.data).forEach(niveau => {
        initialPagination[niveau] = 1;
      });
      setPagination(initialPagination);
    } catch (err) {
      console.error("Erreur lors du chargement des élèves :", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await api.delete(`/api/eleves/${id}`);
        loadData();
      } catch (err) {
        console.error("Erreur de suppression :", err);
      }
    }
  };

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
  const handlePageChange = (niveau, page) =>
    setPagination(prev => ({ ...prev, [niveau]: page }));

  const filterEleves = (eleves) =>
    (eleves || []).filter(e =>
      `${e.nom} ${e.prenom} ${e.classe?.nom || ''}`.toLowerCase().includes(search)
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Liste des élèves</h1>
        <Link to='/admin/eleves/new' className='btn btn-primary gap-2 text-sm sm:text-base'>
          <FaPlus /> Ajouter
        </Link>
      </div>

      {/* Search Bar */}
      <input
        type='text'
        placeholder='🔍 Rechercher un élève...'
        value={search}
        onChange={handleSearch}
        className='input input-bordered w-full sm:w-96 mb-8'
      />

      {/* Liste par niveau */}
      {Object.entries(groupedEleves).map(([niveau, elevesRaw]) => {
        const eleves = Array.isArray(elevesRaw) ? elevesRaw : [elevesRaw];
        const filtered = filterEleves(eleves);
        const totalPages = Math.ceil(filtered.length / perPage);
        const currentPage = pagination[niveau] || 1;
        const startIndex = (currentPage - 1) * perPage;
        const currentEleves = filtered.slice(startIndex, startIndex + perPage);

        if (filtered.length === 0) return null;

        return (
          <div key={niveau} className="mb-8">
            <h2 className="text-lg font-bold text-secondary mb-3">{niveau}</h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border rounded-lg shadow">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-base-200 text-base-content">
                  <tr>
                    <th>Matricule</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Naissance</th>
                    <th>Genre</th>
                    <th>Classe</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEleves.map(e => (
                    <tr key={e._id}>
                      <td>{e.matricule || '-'}</td>
                      <td>{e.nom || '-'}</td>
                      <td>{e.prenom || '-'}</td>
                      <td>{e.dateNaissance ? new Date(e.dateNaissance).toLocaleDateString() : '-'}</td>
                      <td>{e.genre}</td>
                      <td>{e.classe?.nom || '-'}</td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/eleves/edit/${e._id}`)}
                            className="btn btn-xs btn-primary"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(e._id)}
                            className="btn btn-xs btn-error"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4 mt-4">
              {currentEleves.map(e => (
                <div key={e._id} className="card shadow border">
                  <div className="card-body p-4 text-sm">
                    <h3 className="card-title text-base text-primary">
                      {e.nom} {e.prenom}
                    </h3>
                    <p><span className="font-semibold">Matricule :</span> {e.matricule}</p>
                    <p><span className="font-semibold">Naissance :</span> {e.dateNaissance ? new Date(e.dateNaissance).toLocaleDateString() : '-'}</p>
                    <p><span className="font-semibold">Genre :</span> {e.genre}</p>
                    <p><span className="font-semibold">Classe :</span> {e.classe?.nom || '-'}</p>
                    <div className="mt-3 flex gap-2 justify-end">
                      <button onClick={() => navigate(`/admin/eleves/edit/${e._id}`)} className="btn btn-xs btn-primary">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(e._id)} className="btn btn-xs btn-error">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => handlePageChange(niveau, n)}
                    className={`btn btn-sm ${currentPage === n ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
