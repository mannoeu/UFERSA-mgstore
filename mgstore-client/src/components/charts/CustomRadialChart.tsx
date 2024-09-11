"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CustomRadialChartProps {
  title: string;
  subtitle?: string;
  data: Array<object>;
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
}

export function CustomRadialChart({
  title,
  subtitle,
  data,
  config,
  dataKey,
  nameKey,
}: CustomRadialChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={data.map((_, index) => ({
              ..._,
              fill: `hsl(var(--chart-${index + 1}))`,
            }))}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey={nameKey} />}
            />
            <RadialBar dataKey={dataKey} background>
              <LabelList
                position="insideStart"
                dataKey={nameKey}
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
