import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { db } from "../_lib/prisma";

const Transactions = async () => {
  const transactions = await db.transaction.findMany({});

  return (
    <div>
      {transactions.map((transactions) => (
        <div key={transactions.id}> {transactions.name}</div>
      ))}

      {/* TÍTULO E BOTÃO */}
      <div className="flex w-full items-center justify-between p-6">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Button className="roundd-full">
          Adicionar transação
          <ArrowDownUpIcon />
        </Button>
      </div>
    </div>
  );
};

export default Transactions;
