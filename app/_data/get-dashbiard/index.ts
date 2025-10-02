import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TransactionPercentageType } from "./types";

export const getDashboard = async (month: string) => {
  const where = {
    date: {
      gte: new Date(`2025-${month}-01`),
      lt: new Date(`2025-${month}-31`),
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
  const balance = depositsTotal - investmentsTotal - expensesTotal;

  const transactionsTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const typesPercentage: TransactionPercentageType = {
    [TransactionType.DEPOSIT]: Math.round(
      transactionsTotal === 0 ? 0 : (depositsTotal / transactionsTotal) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      transactionsTotal === 0
        ? 0
        : (investmentsTotal / transactionsTotal) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      transactionsTotal === 0 ? 0 : (expensesTotal / transactionsTotal) * 100,
    ),
  };

  //   const typePercentages = {
  //     [TransactionType.DEPOSIT]:
  //       depositsTotal === 0 ? 0 : (depositsTotal / balance) * 100,
  //     [TransactionType.INVESTMENT]:
  //       investmentsTotal === 0 ? 0 : (investmentsTotal / balance) * 100,
  //     [TransactionType.EXPENSE]:
  //       expensesTotal === 0 ? 0 : (expensesTotal / balance) * 100,
  //   } as const;

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
  };
};
