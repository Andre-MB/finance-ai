import { ReactNode } from "react";

interface PercentageItemProps {
  icon: ReactNode;
  title: string;
  value: number;
}

const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      {/* Icone */}
      <div className="flex items-center">
        {/* <TrendingUpIcon size={16} className="text-primary" /> */}
        <div className="mx-2 rounded-lg bg-white bg-opacity-[3%] p-2">
          {icon}
        </div>

        {/* Título */}
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      {/* Porcentagem */}
      <p className="text-sm font-bold">
        {/* {typesPercentage[TransactionType.DEPOSIT]}% */}
        {value}%
      </p>
    </div>
  );
};

export default PercentageItem;
