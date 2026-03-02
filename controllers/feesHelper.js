const { feesData } = require('../models/feesStore');

function getSortedCustomers() {
  return Array.from(new Set(
    Object.values(feesData).flatMap(obj => Object.keys(obj))
  )).sort();
}

function getSortedDates() {
  return Object.keys(feesData).sort();
}

function buildPivotRows(customers, dates) {
  return dates.map(date => {
    const row = { date };
    customers.forEach(cust => {
      row[cust] = feesData[date][cust] !== undefined ? feesData[date][cust] : 0.00;
    });
    return row;
  });
}

module.exports = {
  getSortedCustomers,
  getSortedDates,
  buildPivotRows,
};
