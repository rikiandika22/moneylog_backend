const prisma = require('../prisma/client');

const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await prisma.transaction.findMany({
      where: { userId }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransactions = transactions.length;
    let totalIncomeTransactions = 0;
    let totalExpenseTransactions = 0;

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
        totalIncomeTransactions++;
      } else if (t.type === 'expense') {
        totalExpense += t.amount;
        totalExpenseTransactions++;
      }
    });

    const balance = totalIncome - totalExpense;

    res.json({
      message: "Summary berhasil diambil",
      data: {
        totalIncome,
        totalExpense,
        balance,
        totalTransactions,
        totalIncomeTransactions,
        totalExpenseTransactions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getSummary
};
