import { getCurrentMonthTransactions } from "../get-current-month-transactions";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auth, clerkClient } from "@clerk/nextjs/server";

export const canUserAddTransaction = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const user = await (await clerkClient()).users.getUser(userId);
  if (user.publicMetadata.subscriptionPlan === "premium") {
    return true;
  }

  const currentMonnthTransactions = await getCurrentMonthTransactions();

  if (currentMonnthTransactions >= 10) {
    return false;
  }
  return true;
};
