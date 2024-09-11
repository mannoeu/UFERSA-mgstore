import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatMoney } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface Props {
  data: {
    avatar: string;
    nome_cliente: string;
    id_cliente: number;
    valor_total_gasto: number;
    categorias_compradas: string[];
  };
}

export const BestClient = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Melhor cliente do ano</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 mt-4">
              <Avatar>
                <AvatarImage src={data?.avatar} alt={data?.nome_cliente} />
                <AvatarFallback>{data?.nome_cliente.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-foreground font-bold text-base">
                  {data.nome_cliente}{" "}
                  <sup className="font-normal">#{data.id_cliente}</sup>
                </p>
              </div>
            </div>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex flex-col gap-4">
        <div>
          <span className="text-muted-foreground">Total gasto:</span>
          <h4 className="text-3xl font-bold text-foreground">
            {formatMoney(data.valor_total_gasto)}
          </h4>
        </div>

        <ul className="m-0 p-0 flex items-center flex-wrap gap-2">
          {data.categorias_compradas.map((categoria, index) => (
            <li
              key={index}
              className="text-muted-foreground text-xs px-2 py-0.5 bg-blue-600 text-white rounded-lg"
            >
              {categoria}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
