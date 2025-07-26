const express = require('express');
const router = express.Router();
//const { protect } = require('../middleware/authMiddleware');
const noteCtrl = require('../controllers/noteController');

router.post('/', noteCtrl.ajouterNote);
router.get('/eleve/:id', noteCtrl.notesParEleve);
router.get('/', noteCtrl.getNotes);
router.get('/mes-notes',  noteCtrl.notesDeLEleveConnecte);
router.get('/analyse',  noteCtrl.notesParClasseEtSemestre);
router.get('/eleve/:id', noteCtrl.getNotesById);
router.get('/eleve/:id/moyennes', noteCtrl.getEleveMoyennes);

router.put('/:id', noteCtrl.updateNote);
router.delete('/:id', noteCtrl.deleteNote);



module.exports = router;