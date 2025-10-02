import { TransactionType } from "@prisma/client";

export type TransactionPercentageType = {
  [key in TransactionType]: number;
};
