const express = require('express');
const router = express.Router();
const { createClasse, getClasses, updateClasse, deleteClasse, getClasseById } = require('../controllers/classeController');
//const { protect } = require('../middleware/authMiddleware');
//const { allowRoles } = require('../middleware/roleMiddleware');

// Accessible uniquement aux admins
router.post('/',  createClasse);
router.get('/',  getClasses);
router.get('/:id', getClasseById);
router.put('/:id', updateClasse);
router.delete('/:id', deleteClasse);

module.exports = router;