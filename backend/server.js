const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const classeRoutes = require('./routes/classe');
const coursRoutes = require('./routes/cours');
const eleveRoutes = require('./routes/eleve');
const enseignantRoutes = require('./routes/enseignant');
const matiereRoutes = require('./routes/matiere');
const semestreRoutes = require('./routes/semestre');
const noteRoutes = require('./routes/notes');
const presenceRoutes = require('./routes/presences');
const bulletinRoutes = require('./routes/bulletin');
const emploiRoutes = require('./routes/emploi');
const statsRoutes = require('./routes/stats');


const app = express();

app.use(cors());
app.use(express.json());

// Les Routes
app.use('/api', authRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/matieres', matiereRoutes);
app.use('/api/semestres', semestreRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/bulletins', bulletinRoutes);
app.use('/api/presences', presenceRoutes);
app.use('/api/emploi', emploiRoutes);
app.use('/api/stats', statsRoutes);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
     .then(() => {
		console.log('MongoDb connecte');
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	 })
	 .catch(err => console.log(err));

