const express = require('express');
const router = express.Router();
const {
  createSemestre,
  getSemestres,
  updateSemestre,
  deleteSemestre
} = require('../controllers/semestreController');

//const { protect } = require('../middleware/authMiddleware');
//const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/',  getSemestres);
router.post('/', createSemestre);
router.put('/:id', updateSemestre);
router.delete('/:id', deleteSemestre);

module.exports = router;
