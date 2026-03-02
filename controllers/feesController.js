const { feesData } = require('../models/feesStore');
const { getSortedCustomers, getSortedDates, buildPivotRows } = require('./feesHelper');

// Validate a fee item
function isValidFeeItem(item) {
  return (
    item &&
    typeof item.date === 'string' && item.date.trim() !== '' &&
    typeof item.customer === 'string' && item.customer.trim() !== '' &&
    typeof item.fee === 'number' && !isNaN(item.fee)
  );
}

// POST /addCustomerFees
function addCustomerFees(req, res) {
  const items = Array.isArray(req.body) ? req.body : [];
  let inserted = 0, updated = 0, skipped = 0;

  for (const item of items) {
    if (!isValidFeeItem(item)) {
      skipped++;
      continue;
    }
    const { date, customer, fee } = item;
    if (!feesData[date]) feesData[date] = {};
    if (feesData[date][customer] === undefined) {
      feesData[date][customer] = fee;
      inserted++;
    } else {
      feesData[date][customer] += fee;
      updated++;
    }
  }
  return res.status(200).json({ inserted, updated, skipped });
}

// GET /perCustomerFees
function perCustomerFees(req, res) {
  const customers = getSortedCustomers();
  const dates = getSortedDates();
  const rows = buildPivotRows(customers, dates);
  return res.status(200).json({ rows });
}

// GET /perCustomerFeesAsCsv
function perCustomerFeesAsCsv(req, res) {
  const customers = getSortedCustomers();
  const dates = getSortedDates();
  const rows = buildPivotRows(customers, dates);
  let csv = 'Date,' + customers.join(',') + '\n';
  for (const row of rows) {
    csv += [row.date, ...customers.map(cust => row[cust])].join(',') + '\n';
  }
  res.header('Content-Type', 'text/csv');
  return res.status(200).send(csv);
}

module.exports = {
  addCustomerFees,
  perCustomerFees,
  perCustomerFeesAsCsv,
};
