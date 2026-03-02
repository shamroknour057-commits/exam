const { feesData } = require('../models/feesStore');
const feesController = require('../controllers/feesController');

// Mock Express req/res
function mockRes() {
  return {
    json: jest.fn(),
    header: jest.fn(),
    send: jest.fn(),
  };
}

describe('feesController', () => {
  beforeEach(() => {
    for (const key in feesData) delete feesData[key];
  });

  test('addCustomerFees inserts and updates correctly', () => {
    const req = { body: [
      { date: '2025-01-01', customer: 'A', fee: 10 },
      { date: '2025-01-01', customer: 'A', fee: 5 },
      { date: '2025-01-01', customer: 'B', fee: 7 },
      { date: '', customer: 'C', fee: 3 }, // skipped
    ]};
    const res = mockRes();
    feesController.addCustomerFees(req, res);
    expect(res.json).toHaveBeenCalledWith({ inserted: 2, updated: 1, skipped: 1 });
    expect(feesData['2025-01-01']['A']).toBe(15);
    expect(feesData['2025-01-01']['B']).toBe(7);
  });

  test('perCustomerFees returns correct pivot', () => {
    feesData['2025-01-01'] = { A: 10, B: 5 };
    feesData['2025-01-02'] = { A: 7 };
    const req = {};
    const res = mockRes();
    feesController.perCustomerFees(req, res);
    expect(res.json).toHaveBeenCalledWith({
      rows: [
        { date: '2025-01-01', A: 10, B: 5 },
        { date: '2025-01-02', A: 7, B: 0.00 },
      ],
    });
  });

  test('perCustomerFeesAsCsv returns correct CSV', () => {
    feesData['2025-01-01'] = { A: 10, B: 5 };
    feesData['2025-01-02'] = { A: 7 };
    const req = {};
    const res = mockRes();
    feesController.perCustomerFeesAsCsv(req, res);
    expect(res.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(res.send).toHaveBeenCalledWith(
      'Date,A,B\n2025-01-01,10,5\n2025-01-02,7,0\n'
    );
  });
});
