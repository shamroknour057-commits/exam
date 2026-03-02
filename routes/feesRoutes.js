const express = require('express');
const router = express.Router();
const {
  addCustomerFees,
  perCustomerFees,
  perCustomerFeesAsCsv,
} = require('../controllers/feesController');

router.post('/addCustomerFees', addCustomerFees);
router.get('/perCustomerFees', perCustomerFees);
router.get('/perCustomerFeesAsCsv', perCustomerFeesAsCsv);

module.exports = router;
