const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// GET all plans with optional filters
router.get('/plans', planController.getAllPlans);

// POST toggle plan status
router.post('/plans/:id/toggle-status', planController.togglePlanStatus);

// DELETE a plan
router.delete('/plans/:id', planController.deletePlan);

module.exports = router;
