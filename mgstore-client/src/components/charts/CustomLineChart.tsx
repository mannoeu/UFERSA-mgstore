"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatMoney } from "@/lib/utils";

const chartData = [
  {
    nome_campanha: "Campanha 1",
    nome_canal: "Revendedor",
    clientes_alcancados: 40,
    total_vendas: 313,
    receita_total: 24140.8,
  },
  {
    nome_campanha: "Campanha 2",
    nome_canal: "Revendedor",
    clientes_alcancados: 38,
    total_vendas: 315,
    receita_total: 25324.23,
  },
  {
    nome_campanha: "Campanha 3",
    nome_canal: "Online",
    clientes_alcancados: 33,
    total_vendas: 230,
    receita_total: 21502.31,
  },
  {
    nome_campanha: "Campanha 4",
    nome_canal: "Revendedor",
    clientes_alcancados: 41,
    total_vendas: 317,
    receita_total: 27477.81,
  },
  {
    nome_campanha: "Campanha 5",
    nome_canal: "Loja Física",
    clientes_alcancados: 38,
    total_vendas: 263,
    receita_total: 25820.4,
  },
  {
    nome_campanha: "Campanha 6",
    nome_canal: "Telemarketing",
    clientes_alcancados: 34,
    total_vendas: 248,
    receita_total: 21062.44,
  },
  {
    nome_campanha: "Campanha 7",
    nome_canal: "Telemarketing",
    clientes_alcancados: 48,
    total_vendas: 353,
    receita_total: 33990.81,
  },
  {
    nome_campanha: "Campanha 8",
    nome_canal: "Loja Física",
    clientes_alcancados: 34,
    total_vendas: 246,
    receita_total: 20050.52,
  },
  {
    nome_campanha: "Campanha 9",
    nome_canal: "Revendedor",
    clientes_alcancados: 35,
    total_vendas: 250,
    receita_total: 20051.87,
  },
  {
    nome_campanha: "Campanha 10",
    nome_canal: "Revendedor",
    clientes_alcancados: 41,
    total_vendas: 291,
    receita_total: 27816.3,
  },
  {
    nome_campanha: "Campanha 11",
    nome_canal: "Online",
    clientes_alcancados: 37,
    total_vendas: 187,
    receita_total: 21137.46,
  },
  {
    nome_campanha: "Campanha 12",
    nome_canal: "Revendedor",
    clientes_alcancados: 38,
    total_vendas: 265,
    receita_total: 25397.84,
  },
  {
    nome_campanha: "Campanha 13",
    nome_canal: "Telemarketing",
    clientes_alcancados: 37,
    total_vendas: 299,
    receita_total: 27249.99,
  },
  {
    nome_campanha: "Campanha 14",
    nome_canal: "Loja Física",
    clientes_alcancados: 40,
    total_vendas: 295,
    receita_total: 27684.15,
  },
  {
    nome_campanha: "Campanha 15",
    nome_canal: "Revendedor",
    clientes_alcancados: 45,
    total_vendas: 319,
    receita_total: 27568.21,
  },
  {
    nome_campanha: "Campanha 16",
    nome_canal: "Online",
    clientes_alcancados: 43,
    total_vendas: 284,
    receita_total: 29729.64,
  },
  {
    nome_campanha: "Campanha 17",
    nome_canal: "Telemarketing",
    clientes_alcancados: 37,
    total_vendas: 216,
    receita_total: 23675.16,
  },
  {
    nome_campanha: "Campanha 18",
    nome_canal: "Online",
    clientes_alcancados: 38,
    total_vendas: 248,
    receita_total: 22155.35,
  },
  {
    nome_campanha: "Campanha 19",
    nome_canal: "Revendedor",
    clientes_alcancados: 43,
    total_vendas: 311,
    receita_total: 23599.63,
  },
  {
    nome_campanha: "Campanha 20",
    nome_canal: "Telemarketing",
    clientes_alcancados: 44,
    total_vendas: 314,
    receita_total: 26441.6,
  },
];

const chartConfig = {
  nome_campanha: {
    label: "nome_campanha",
  },
  total_vendas: {
    label: "Vendas",
    color: "hsl(var(--chart-1))",
  },
  receita_total: {
    label: "Receita total",
    color: "hsl(var(--chart-2))",
  },
  clientes_alcancados: {
    label: "Clientes",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function CustomLineChart() {
  const [activeChart, setActiveChart] = React.useState<
    keyof typeof chartConfig
  >("clientes_alcancados");

  const total = React.useMemo(
    () => ({
      clientes_alcancados: chartData.reduce(
        (acc, curr) => acc + curr.clientes_alcancados,
        0
      ),
      total_vendas: chartData.reduce((acc, curr) => acc + curr.total_vendas, 0),
      receita_total: formatMoney(
        chartData.reduce((acc, curr) => acc + curr.receita_total, 0)
      ),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Resultado das Campanhas</CardTitle>
          <CardDescription>
            Desempenho das campanhas de marketing
          </CardDescription>
        </div>
        <div className="flex">
          {["clientes_alcancados", "total_vendas", "receita_total"].map(
            (key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nome_campanha"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(value) => {
                return value[0] + value.split(" ")[1];
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
