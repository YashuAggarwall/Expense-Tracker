const { simplifyDebts } = require('../utils/debtSimplifier');

describe('Debt Simplification Algorithm (Minimum Cash Flow)', () => {
  it('should return empty settlements when there are no expenses', () => {
    const members = [{ _id: '1', name: 'Alice' }, { _id: '2', name: 'Bob' }];
    const result = simplifyDebts(members, []);

    expect(result.settlements).toEqual([]);
    expect(result.totalExpenses).toBe(0);
    expect(result.netBalances.length).toBe(2);
    expect(result.netBalances[0].netBalance).toBe(0);
  });

  it('should correctly simplify debts for a 3-member group', () => {
    const members = [
      { _id: '1', name: 'Alex' },
      { _id: '2', name: 'Bob' },
      { _id: '3', name: 'Charlie' }
    ];

    const expenses = [
      { paidBy: 'Alex', expense: 600 },
      { paidBy: 'Bob', expense: 300 }
    ];

    const result = simplifyDebts(members, expenses);

    expect(result.totalExpenses).toBe(900);
    expect(result.perPersonShare).toBe(300);
    expect(result.settlements).toHaveLength(1);
    expect(result.settlements[0]).toEqual({
      from: 'Charlie',
      to: 'Alex',
      amount: 300
    });
  });

  it('should zero out balance after a direct settlement is recorded', () => {
    const members = [
      { _id: '1', name: 'Alex' },
      { _id: '2', name: 'Bob' }
    ];

    const expenses = [
      { paidBy: 'Alex', expense: 200, category: 'Lunch' }, // Bob owes Alex 100
      { paidBy: 'Bob', settledWith: 'Alex', expense: 100, isSettlement: true } // Bob settles Alex
    ];

    const result = simplifyDebts(members, expenses);

    expect(result.totalExpenses).toBe(200); // Settlement does not inflate purchase total
    expect(result.settlements).toHaveLength(0); // All settled!
    expect(result.netBalances[0].netBalance).toBe(0);
    expect(result.netBalances[1].netBalance).toBe(0);
  });
});
