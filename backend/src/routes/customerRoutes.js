import express from 'express';
import { 
  getCustomers, 
  getCustomerById, 
  updateCustomerNotes, 
  getCustomerMatches, 
  generateAIIntro 
} from '../controllers/customerController.js';

const router = express.Router();

// Route mappings
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id/notes', updateCustomerNotes);
router.get('/:id/matches', getCustomerMatches);
router.post('/:id/matches/:matchId/intro', generateAIIntro);

export default router;
