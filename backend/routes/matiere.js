const express = require('express');
const router = express.Router();
const {
  createMatiere,
  getMatieres,
  updateMatiere,
  deleteMatiere
} = require('../controllers/matiereController');

//const { protect } = require('../middleware/authMiddleware');
//const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', getMatieres);
router.post('/', createMatiere);
router.put('/:id', updateMatiere);
router.delete('/:id', deleteMatiere);

module.exports = router;