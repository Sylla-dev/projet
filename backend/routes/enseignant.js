const express = require('express');
const router = express.Router();
const {
  createEnseignant,
  getEnseignants,
  updateEnseignant,
  deleteEnseignant,
  getMesClasses,
  getInfosPourCours,
  affecterClasses,
  affecterMatieres,
  affecterCreneaux,
  ajouterCahierCharges
} = require('../controllers/enseignantController');

//const { protect } = require('../middleware/authMiddleware');
//const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/',  getEnseignants);
router.post('/', createEnseignant);
router.put('/:id',  updateEnseignant);
router.delete('/:id', deleteEnseignant);
router.get('/mes-classes',  getMesClasses);
router.get('/infos-pour-cours',  getInfosPourCours);

router.put('/:id/classes', affecterClasses);
router.put('/:id/matieres',affecterMatieres);
router.put('/:id/creneaux',  affecterCreneaux);
router.put('/:id/cahier',  ajouterCahierCharges);



module.exports = router;