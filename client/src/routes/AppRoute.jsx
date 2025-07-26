import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DashboardLayout from "../layouts/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EleveDashboard from "../pages/eleve/EleveDashboard";
import EnseignantDashboard from "../pages/enseignant/EnseignantDashboard";
import ClassList from "../pages/admin/ClasseListe";
import ClasseForm from "../pages/admin/ClasseForm";

import EleveList from "../pages/admin/EleveListe";
import EleveForm from "../pages/admin/EleveForm";

import EnseignantListe from "../pages/admin/EnseignantListe";

import MatiereListe from "../pages/admin/MatiereListe";
import MatiereForm from "../pages/admin/MatiereForm";
import MesCours from "../pages/enseignant/MesCours";
import AjoutCours from "../pages/enseignant/CoursForm";
import ListeCoursEleve from "../pages/eleve/ListCoursEleve";
import Semestres from "../pages/admin/Semestres";
import ListeNotesEnseignant from "../pages/enseignant/ListeNotesEnseignant";
import AjouterNote from "../pages/enseignant/AjouteNote";
import ListeNotesEleve from "../pages/eleve/ListeNotesEleve";
import AdminBulletins from "../pages/admin/AdminBulletin";
import AjouterBulletin from "../pages/admin/AjouterBulletin";
import AjoutEmploi from "../pages/admin/AjoutEmploi";
import ListePresences from "../pages/admin/ListePresences";
import ModifierNote from "../pages/enseignant/ModifierNote";
import AdminEmploiManager from "../pages/admin/AdminEmploiManager";
import AnalyseNotes from "../pages/admin/AnalyseNotes";
import BulletinDetails from "../components/BulletinDetails";
import EmploiEnseignant from "../pages/enseignant/EmploiEnseignant";
import EmploiEleve from "../pages/eleve/EmploiEleve";
import PresenceCours from "../pages/enseignant/PresenceCours";

function PrivateRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

function DashboardRouter() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "enseignant") return <EnseignantDashboard />;
  if (user.role === "eleve") return <EleveDashboard />;
  
  return <div>Rôle inconnu</div>;
}

function AppRoute() {
	return (
		<Router>
			<Routes>
				{/** Route publique */}
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />

				{/** Routes necessitant authentification */}
				<Route path="/" element={<PrivateRoute allowedRoles={["admin", "enseignant", "eleve"]}><DashboardLayout /></PrivateRoute>}>
				<Route index element={<DashboardRouter />} />  

                    {/** Routes admin */}
			        <Route path="admin/classes" element={<ClassList />} />		
			        <Route path="admin/classes/new" element={<ClasseForm />} />		
			        <Route path="admin/classes/edit/:id" element={<ClasseForm />} />

					<Route path="admin/eleves" element={<EleveList />} />		
					<Route path="admin/eleves/new" element={<EleveForm />} />		
					<Route path="admin/eleves/edit/:id" element={<EleveForm />} />	

					<Route path="admin/enseignants" element={<EnseignantListe />} />

					<Route path="admin/matieres" element={<MatiereListe />}	/>
					<Route path="admin/matieres/new" element={<MatiereForm />}	/>
					<Route path="admin/matieres/edit/:id" element={<MatiereForm />}	/>

					<Route path="/admin/mescours" element={<MesCours />} />
					<Route path="/admin/mescours/new" element={<AjoutCours />} />
					<Route path="admin/semestres" element={<Semestres />} />
					<Route path="admin/bulletins" element={<AdminBulletins />} />
					<Route path="admin/bulletins/new" element={<AjouterBulletin />} />
					<Route path="admin/bulletins/:id" element={<BulletinDetails />} />
					<Route path="admin/emploi/new" element={<AjoutEmploi />} />
					 <Route path='admin/presences' element={<ListePresences />} />
					 <Route path="admin/emploi" element={<AdminEmploiManager />} />
					 <Route path="admin/analyse-notes" element={<AnalyseNotes />} />


					{/** Routes eleves */}
					<Route path="eleve/mescours" element={<ListeCoursEleve />} />
					<Route path="eleve/notes" element={<ListeNotesEleve />} />
					<Route path="eleve/emploi" element={<EmploiEleve />} />

					{/** Routes enseignants */}
					<Route path="enseignant/notes" element={<ListeNotesEnseignant />} />
					<Route path="enseignant/notes/new" element={<AjouterNote />} />
					<Route path="enseignant/notes/edit/:id" element={<ModifierNote />} />
					<Route path="enseignant/emplois/:id" element={<EmploiEnseignant />} />
				    <Route path="/cours/:coursId/presences" element={<PresenceCours />} />
					<Route path="/enseignant/mescours" element={<MesCours />} />

				</Route>
			</Routes>
		</Router>
	)
}

export default AppRoute;