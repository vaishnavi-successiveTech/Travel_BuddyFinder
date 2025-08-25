export async function splitCosts(req, res) {
  const { items, participants } = req.body;
  // items: [{ label, amount, paidByUserId, splitAmongUserIds[] }]
  // participants: [{ userId }]
  const totals = {};
  participants.forEach(p => totals[p.userId] = { owes: 0, paid: 0 });

  for (const it of items) {
    const share = it.amount / it.splitAmongUserIds.length;
    it.splitAmongUserIds.forEach(uid => totals[uid].owes += share);
    totals[it.paidByUserId].paid += it.amount;
  }

  const settlements = Object.entries(totals).map(([uid, t]) => ({
    userId: uid, balance: +(t.paid - t.owes).toFixed(2)
  }));
  res.json({ settlements });
}
