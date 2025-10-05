import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-char";
import { getDashboard } from "../_data/get-dashbiard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transaction";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const monthIsInValid = !month || !isMatch(month, "MM");

  if (monthIsInValid) {
    redirect(`?month=${new Date().getMonth() + 1}`); // Default to January if no valid month is provided
  }

  const dashboard = await getDashboard(month);

  return (
    <>
      <Navbar />

      <div className="flex flex-col space-y-3 overflow-hidden p-3">
        <div className="flex-align-center flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>

        <div className="grid grid-cols-[2fr,1fr] gap-2 overflow-hidden">
          <div className="flex flex-col gap-3 overflow-hidden">
            {/* <div className="grid grid-cols-[2fr,1fr]"> */}
            <SummaryCards month={month} {...dashboard} />

            <div className="grid grid-cols-3 grid-rows-1 gap-3 overflow-hidden">
              <TransactionsPieChart {...dashboard} />

              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>

          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>

        {/*  */}
      </div>
    </>
  );
};

export default Home;
