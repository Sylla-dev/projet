// routes/presences.js
const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/PresenceController');
//const { protect } = require('../middleware/authMiddleware');

router.post('/',  presenceController.marquerPresence);
router.get('/classe/:classeId',  presenceController.getPresencesParClasse);
router.get('/eleve/:eleveId/historique', presenceController.historiquePresenceEleve);
router.get('/eleve/:eleveId/:export-pdf', presenceController.exportPresencePDF);
router.get('/',  presenceController.getPresences);

module.exports = router;
