import express from 'express';
import { createEngineer, updateEngineer } from '../controllers/engineer.controller.js';
import { uploadEngineerPhoto } from '../middleware/upload_photo.js';
// import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add engineer
router.post(
  '/',
//   authMiddleware,
  uploadEngineerPhoto.single('photo'),
  createEngineer
);

// Update engineer
router.put(
  '/:id',
//   authMiddleware,
  uploadEngineerPhoto.single('photo'),
  updateEngineer
);

export default router;
