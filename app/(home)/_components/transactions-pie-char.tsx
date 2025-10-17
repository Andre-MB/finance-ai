"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashbiard/types";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";

export const description = "A donut chart";

// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "#55802B" },
//   { browser: "safari", visitors: 200, fill: "#FFFFFF" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ];

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Depositado",
    color: "#55802B",
  },
  [TransactionType.EXPENSE]: {
    label: "Gasto",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  const chartData = [
    { type: "Depositado", amount: depositsTotal, fill: "#55802B" },
    { type: "Investido", amount: investmentsTotal, fill: "#FFFFFF" },
    { type: "Gasto", amount: expensesTotal, fill: "#E93030" },
  ];

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 p-3">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>

        <div className="space-y-2 px-[20%] text-center">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receita"
            value={
              isNaN(typesPercentage[TransactionType.DEPOSIT])
                ? 0
                : typesPercentage[TransactionType.DEPOSIT]
            }
          />

          <PercentageItem
            icon={<PiggyBankIcon size={16} className="text-white" />}
            title="Investido"
            value={
              isNaN(typesPercentage[TransactionType.INVESTMENT])
                ? 0
                : typesPercentage[TransactionType.INVESTMENT]
            }
          />

          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-red-500" />}
            title="Despesas"
            value={
              isNaN(typesPercentage[TransactionType.EXPENSE])
                ? 0
                : typesPercentage[TransactionType.EXPENSE]
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;
