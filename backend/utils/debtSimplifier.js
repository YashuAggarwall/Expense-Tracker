/**
 * Algorithmic Debt Simplification (Minimum Cash Flow)
 * 
 * Computes net balances for all group members and produces the optimal
 * (minimum) number of peer-to-peer repayment transactions using a greedy approach.
 */

function simplifyDebts(members, expenses) {
  if (!members || members.length === 0) {
    return { netBalances: [], settlements: [], totalExpenses: 0, transactionsSaved: 0 };
  }

  // 1. Map member identifiers to readable display names
  const memberMap = new Map();
  members.forEach((m) => {
    const name = m.name || m.username || 'Member';
    memberMap.set(name.toLowerCase(), name);
  });

  const memberNames = Array.from(memberMap.values());
  const numMembers = memberNames.length;

  if (numMembers <= 1 || !expenses || expenses.length === 0) {
    const defaultBalances = memberNames.map((name) => ({
      name,
      paid: 0,
      share: 0,
      netBalance: 0,
      status: 'settled',
    }));
    return {
      netBalances: defaultBalances,
      settlements: [],
      totalExpenses: 0,
      perPersonShare: 0,
      transactionsSaved: 0,
    };
  }

  // 2. Track total amounts paid and individual net balances
  const netDelta = {};
  const totalPaid = {};
  memberNames.forEach((name) => {
    netDelta[name] = 0;
    totalPaid[name] = 0;
  });

  let totalExpenses = 0;

  expenses.forEach((item) => {
    const amount = Number(item.expense) || 0;
    const rawPayer = (item.paidBy || '').trim().toLowerCase();
    const payer = memberMap.get(rawPayer) || item.paidBy || memberNames[0];

    if (item.isSettlement) {
      // Direct peer-to-peer debt settlement:
      // payer gave amount to settledWith
      const rawReceiver = (item.settledWith || '').trim().toLowerCase();
      const receiver = memberMap.get(rawReceiver) || item.settledWith;

      if (netDelta[payer] !== undefined) netDelta[payer] += amount;
      if (receiver && netDelta[receiver] !== undefined) netDelta[receiver] -= amount;
    } else {
      // Normal shared group expenditure:
      totalExpenses += amount;
      if (totalPaid[payer] !== undefined) totalPaid[payer] += amount;

      const perPersonShare = amount / numMembers;
      memberNames.forEach((name) => {
        if (name === payer) {
          netDelta[name] += (amount - perPersonShare);
        } else {
          netDelta[name] -= perPersonShare;
        }
      });
    }
  });

  const fairShare = totalExpenses / numMembers;

  // 3. Assemble net balances
  const balances = [];
  const netBalances = [];

  memberNames.forEach((name) => {
    const paid = totalPaid[name] || 0;
    const net = Math.round(netDelta[name] * 100) / 100;

    let status = 'settled';
    if (net > 0.01) status = 'gets';
    else if (net < -0.01) status = 'owes';

    netBalances.push({
      name,
      paid: Math.round(paid * 100) / 100,
      share: Math.round(fairShare * 100) / 100,
      netBalance: net,
      status,
    });

    if (Math.abs(net) > 0.01) {
      balances.push({ name, amount: net });
    }
  });

  // Separate creditors (gets money) and debtors (owes money)
  const creditors = balances
    .filter((b) => b.amount > 0.01)
    .sort((a, b) => b.amount - a.amount);

  const debtors = balances
    .filter((b) => b.amount < -0.01)
    .sort((a, b) => a.amount - b.amount);

  const settlements = [];

  let i = 0; // creditor index
  let j = 0; // debtor index

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const oweAmount = Math.abs(debtor.amount);
    const settleAmount = Math.min(creditor.amount, oweAmount);

    if (settleAmount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settleAmount * 100) / 100,
      });
    }

    creditor.amount = Math.round((creditor.amount - settleAmount) * 100) / 100;
    debtor.amount = Math.round((debtor.amount + settleAmount) * 100) / 100;

    if (creditor.amount <= 0.01) i++;
    if (Math.abs(debtor.amount) <= 0.01) j++;
  }

  const unsimplifiedEstimate = Math.max(
    settlements.length,
    Math.min(expenses.length, numMembers * (numMembers - 1) / 2)
  );
  const transactionsSaved = Math.max(0, unsimplifiedEstimate - settlements.length);

  return {
    netBalances,
    settlements,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    perPersonShare: Math.round(fairShare * 100) / 100,
    transactionsSaved,
  };
}

module.exports = { simplifyDebts };
