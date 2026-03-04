function getSortedCustomers(feesData = {}) {
  const customersSet = new Set();

  for (const dateData of Object.values(feesData)) {
    if (!dateData || typeof dateData !== 'object') continue;

    for (const customer of Object.keys(dateData)) {
      customersSet.add(customer);
    }
  }

  return Array.from(customersSet).sort();
}

function getSortedDates(feesData = {}) {
  return Object.keys(feesData).sort();
}

function buildPivotRows(customers = [], dates = [], feesData = {}) {
  const rows = [];

  for (const date of dates) {
    const row = { date };
    const dateData = feesData[date] ?? {};

    for (const customer of customers) {
      row[customer] = dateData[customer] ?? 0.0;
    }

    rows.push(row);
  }

  return rows;
}

module.exports = {
  getSortedCustomers,
  getSortedDates,
  buildPivotRows,
};