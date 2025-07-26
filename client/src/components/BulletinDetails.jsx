import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BulletinDetails() {
  const { id } = useParams();
  const [bulletin, setBulletin] = useState(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();

  const logoUrl = '/logo-ecole.png';

  useEffect(() => {
    const fetchBulletin = async () => {
      try {
        const res = await api.get(`/api/bulletins/${id}`);
        setBulletin(res.data);
      } catch {
        // Erreur silencieuse, on pourrait améliorer
      } finally {
        setLoading(false);
      }
    };
    fetchBulletin();
  }, [id]);

  const loadImageBase64 = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const handleExportPDF = async () => {
    if (!bulletin) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const marginLeft = 40;
    const lineHeight = 20;
    const today = new Date().toLocaleDateString();
    const logoImg = await loadImageBase64(logoUrl);

    if (logoImg) doc.addImage(logoImg, 'PNG', marginLeft, 20, 50, 50);

    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text('École Excellence Académie', marginLeft + 60, 40);

    doc.setFontSize(11).setFont('helvetica', 'normal');
    doc.text(`Date de génération : ${today}`, marginLeft + 60, 60);

    doc.line(marginLeft, 75, 550, 75);

    doc.setFontSize(14).text(`Bulletin de ${bulletin.eleve.nom}`, marginLeft, 100);
    doc.setFontSize(12);
    doc.text(`Semestre : ${bulletin.semestre}`, marginLeft, 120);
    doc.text(`Classe : ${bulletin.classe.nom}`, marginLeft, 135);

    autoTable(doc, {
      startY: 150,
      head: [['Matière', 'Moyenne']],
      body: bulletin.notes.map((note) => [note.matiere.nom, note.moyenne?.toFixed(2) ?? '—']),
      theme: 'striped',
      styles: { fontSize: 10, halign: 'left', cellPadding: 6 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text(`Moyenne générale : ${bulletin.moyenneGenerale?.toFixed(2) ?? '—'}`, marginLeft, finalY);

    doc.setFont('helvetica', 'normal');
    doc.text(`Appréciation : ${bulletin.appreciation || '—'}`, marginLeft, finalY + lineHeight);

    doc.save(`bulletin_${bulletin.eleve.nom}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-ring loading-lg text-primary" />
      </div>
    );
  }

  if (!bulletin) {
    return <div className="alert alert-error">Impossible de charger le bulletin.</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Bulletin de {bulletin.eleve.nom} • Semestre {bulletin.semestre}
          <br className="md:hidden" />
          <span className="text-base text-gray-500">Classe {bulletin.classe.nom}</span>
        </h2>
        <button onClick={handleExportPDF} className="btn btn-primary btn-sm md:btn-md">
          📄 Exporter en PDF
        </button>
      </div>

      <div ref={pdfRef} className="bg-base-100 p-4 rounded-xl shadow space-y-6">
        {/* Table Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full border border-base-300 rounded">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th className="p-2">Matière</th>
                <th className="p-2">Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {bulletin.notes.map((n, i) => (
                <tr key={i}>
                  <td className="p-2">{n.matiere.nom}</td>
                  <td className="p-2">{n.moyenne?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cartes Mobile */}
        <div className="md:hidden space-y-4">
          {bulletin.notes.map((n, i) => (
            <div key={i} className="card bg-base-100 shadow-md p-4 border border-base-300">
              <p><span className="font-semibold">Matière :</span> {n.matiere.nom}</p>
              <p><span className="font-semibold">Moyenne :</span> {n.moyenne?.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Moyenne générale */}
        <div className="pt-4 border-t border-base-300 space-y-2">
          <p className="text-lg font-semibold">
            🎯 Moyenne générale : {bulletin.moyenneGenerale?.toFixed(2)}
          </p>
          <p>🗣️ Appréciation : {bulletin.appreciation || '—'}</p>
        </div>
      </div>
    </div>
  );
}
