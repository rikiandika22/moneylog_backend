const prisma = require('../prisma/client');

const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, type, category, date, note } = req.body;

    if (!title) return res.status(400).json({ message: "Title wajib diisi" });
    if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount harus angka dan lebih dari 0" });
    }
    if (!type || (type !== 'income' && type !== 'expense')) {
      return res.status(400).json({ message: "Type wajib diisi dan harus berupa 'income' atau 'expense'" });
    }
    if (!category) return res.status(400).json({ message: "Category wajib diisi" });
    if (!date) return res.status(400).json({ message: "Date wajib diisi" });

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        title,
        amount: parseInt(amount, 10),
        type,
        category,
        date: new Date(date),
        note: note || null
      }
    });

    res.status(201).json({
      message: "Transaksi berhasil ditambahkan",
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    const { title, amount, type, category, date, note } = req.body;

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (!title) return res.status(400).json({ message: "Title wajib diisi" });
    if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount harus angka dan lebih dari 0" });
    }
    if (!type || (type !== 'income' && type !== 'expense')) {
      return res.status(400).json({ message: "Type wajib diisi dan harus berupa 'income' atau 'expense'" });
    }
    if (!category) return res.status(400).json({ message: "Category wajib diisi" });
    if (!date) return res.status(400).json({ message: "Date wajib diisi" });

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        title,
        amount: parseInt(amount, 10),
        type,
        category,
        date: new Date(date),
        note: note || null
      }
    });

    res.json({
      message: "Transaksi berhasil diperbarui",
      data: updatedTransaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
