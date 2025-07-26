const express = require('express');
const router = express.Router();
const { createCours, getCours, getCoursByEnseignant, deleteCours, getCoursPourEleve, getCoursById } = require('../controllers/coursController');
//const { protect } = require('../middleware/authMiddleware');
//const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/', createCours);
router.get('/',  getCours);
router.get('/mes-cours',  getCoursByEnseignant);
router.get('/',  getCoursPourEleve);
router.get('/:id',  getCoursById);

router.delete('/:id',  deleteCours);



module.exports = router;