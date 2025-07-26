import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import HistoriquePresence from '../../components/HistoriquePresence';

export default function ListePresences() {
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const res = await api.get('/api/presences');
        setPresences(res.data || []);
      } catch (err) {
        console.error('Erreur récupération présences :', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPresences();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF('landscape', 'pt', 'a4');
    doc.setFontSize(18);
    doc.text('Historique des présences', 40, 40);

    const columns = [
      { header: "Nom de l'élève", dataKey: "nomComplet" },
      { header: "Classe", dataKey: "classe" },
      { header: "Cours", dataKey: "cours" },
      { header: "Date du cours", dataKey: "dateCours" },
      { header: "Statut", dataKey: "statusLibelle" },
    ];

    const rows = presences.map(p => ({
      nomComplet: `${p.eleve?.nom || ''} ${p.eleve?.prenom || ''}`,
      classe: p.eleve?.classe?.nom || '',
      cours: p.cours?.titre || '',
      dateCours: p.cours?.date ? new Date(p.cours.date).toLocaleDateString() : '',
      statusLibelle:
        p.status === 'présent' ? 'Présent' :
        p.status === 'absent_justifie' ? 'Absent Justifié' :
        p.status === 'absent_non_justifie' ? 'Absent Injustifié' : p.status
    }));

    autoTable(doc, {
      startY: 60,
      columns,
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save('historique_presences.pdf');
  };

  const renderStatut = (status) => {
    const label =
      status === 'présent' ? 'Présent' :
      status === 'absent_justifie' ? 'Absent Justifié' :
      status === 'absent_non_justifie' ? 'Absent Injustifié' :
      status;

    const color =
      status === 'présent' ? 'badge-success' :
      status === 'absent_justifie' ? 'badge-warning' :
      status === 'absent_non_justifie' ? 'badge-error' : 'badge-neutral';

    return <span className={`badge ${color} text-white badge-sm`}>{label}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Historique des présences</h1>
        <button onClick={exportPDF} className="btn btn-primary w-full sm:w-auto">
          📄 Exporter PDF
        </button>
      </div>

      <HistoriquePresence />

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      ) : presences.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>Aucune donnée de présence.</p>
        </div>
      ) : (
        <>
          {/* 🖥️ Table View for Desktop */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <table className="table table-zebra w-full text-sm">
              <thead className="bg-base-200 text-base font-semibold">
                <tr>
                  <th>Nom de l'élève</th>
                  <th>Classe</th>
                  <th>Cours</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {presences.map((p) => (
                  <tr key={p._id}>
                    <td>{p.eleve?.nom} {p.eleve?.prenom}</td>
                    <td>{p.eleve?.classe?.nom}</td>
                    <td>{p.cours?.titre}</td>
                    <td>{p.cours?.date ? new Date(p.cours.date).toLocaleDateString() : ''}</td>
                    <td>{renderStatut(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 Card View for Mobile */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {presences.map((p) => (
              <div key={p._id} className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body p-4">
                  <h2 className="card-title text-lg">
                    {p.eleve?.nom} {p.eleve?.prenom}
                  </h2>
                  <p><strong>Classe :</strong> {p.eleve?.classe?.nom}</p>
                  <p><strong>Cours :</strong> {p.cours?.titre}</p>
                  <p><strong>Date :</strong> {p.cours?.date ? new Date(p.cours.date).toLocaleDateString() : ''}</p>
                  <p><strong>Statut :</strong> {renderStatut(p.status)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
