import Image from "next/image";

import { CustomPieChart } from "@/components/charts/CustomPieChart";
import { CustomLineChart } from "@/components/charts/CustomLineChart";
import { CustomRadialChart } from "@/components/charts/CustomRadialChart";

import { formatMoney } from "@/lib/utils";

import { BestClient } from "@/components/bestClient";

import { api } from "@/services/api";

const pieChartConfig = {
  total_clientes_alcancados: {
    label: "Clientes alcançados",
  },
  total_receita: {
    label: "Receita total",
  },
};

const radialChartConfig = {
  nome_produto: {
    label: "Quantidade",
  },
};

interface PieChartItem {
  total_clientes_alcancados: number;
  total_receita: number;
}

export default async function Page() {
  const currentYear = new Date().getFullYear();

  const [
    { data: radialChartData_maior },
    { data: radialChartData_menor },
    { data: bestClientOfCurrentYear },
    { data: pieChartData },
  ] = await Promise.all([
    api.get(`/produtos/maior-saida/${currentYear}`),
    api.get(`/produtos/menor-saida/${currentYear}`),
    api.get(`/vendas/top-comprador/${currentYear}`),
    api.get(`/campanhas/resultado-por-canal`),
  ]);

  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <Image alt="MG Store Logo" src="/logo.png" width={168} height={20} />
      <div className="grid w-full gap-6">
        <BestClient data={bestClientOfCurrentYear} />
      </div>

      <div className="grid w-full gap-6 sm:grid-cols-2">
        <CustomPieChart
          title="Clientes"
          subtitle="Total de clientes alcançados por canal"
          data={pieChartData}
          config={pieChartConfig}
          label="Clientes"
          dataKey="total_clientes_alcancados"
          nameKey="nome_canal"
          total={pieChartData?.reduce(
            (acc: number, cur: PieChartItem) =>
              acc + cur.total_clientes_alcancados,
            0
          )}
        />
        <CustomPieChart
          title="Receita"
          subtitle="Receita total alcançada por canal"
          data={pieChartData}
          config={pieChartConfig}
          label="Receita"
          dataKey="total_receita"
          nameKey="nome_canal"
          total={formatMoney(
            pieChartData.reduce(
              (acc: number, cur: PieChartItem) => acc + cur.total_receita,
              0
            )
          )}
        />
      </div>

      <div className="grid w-full">
        <CustomLineChart />
      </div>

      <div className="grid w-full gap-6 sm:grid-cols-2">
        <CustomRadialChart
          title="Top 5 mais vendidos"
          subtitle="Relativo ao ano de 2024"
          data={radialChartData_maior}
          config={radialChartConfig}
          dataKey="total_vendido"
          nameKey="nome_produto"
        />
        <CustomRadialChart
          title="Top 5 menos vendidos"
          subtitle="Relativo ao ano de 2024"
          data={radialChartData_menor}
          config={radialChartConfig}
          dataKey="total_vendido"
          nameKey="nome_produto"
        />
      </div>
    </div>
  );
}
