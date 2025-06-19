import { DataTable } from "../_components/ui/data-tablel";
import { db } from "../_lib/prisma";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Transactions = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
  });

  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        {/* {transactions.map((transactions) => (
        <div key={transactions.id}> {transactions.name}</div>
      ))} */}

        {/* TÍTULO E BOTÃO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton />
        </div>

        <DataTable columns={transactionColumns} data={transactions} />
      </div>
    </>
  );
};

export default Transactions;
