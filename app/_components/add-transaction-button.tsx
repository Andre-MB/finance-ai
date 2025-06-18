"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowDownUpIcon } from "lucide-react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";

const AddTransactionButton = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setDialogOpen(true)}
      >
        Adicionar transação
        <ArrowDownUpIcon />
      </Button>

      <UpsertTransactionDialog isOpen={dialogOpen} setIsOpen={setDialogOpen} />
    </>
  );
};

export default AddTransactionButton;
