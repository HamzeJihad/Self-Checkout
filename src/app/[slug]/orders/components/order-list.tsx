'use client'
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";
interface OrderListProps {
    orders: Prisma.OrderGetPayload<{
        include: {
            restaurant: {
                select: {
                    name: true,
                    avatarImageUrl: true,
                }
            },
            orderProducts: {
                include: {
                    product: true,
                }
            }
        }
    }>[]
}


const getStatusLabel = (status: OrderStatus) => {
    if (status === "FINISHED") return "Finalizado";
    if (status === "IN_PREPARATION") return "Em preparo";
    if (status === "PENDING") return "Pendente";
    if (status === "PAYMENT_CONFIRMED") return "Pagamento confirmado";
    if (status === "PAYMENT_FAILED") return "Pagamento falhou";
    return "";
};

const OrderList = ({ orders }: OrderListProps) => {
    const {slug} = useParams<{slug: string}>();
    const router = useRouter();
    const searchParams  = useSearchParams();
    const handleGoBack = () => {
       router.push(`/${slug}/menu?consumptionMethod=${searchParams.get("consumptionMethod")}`);
    };
    return (
        <div className="space-y-4 p-6">
            <Button size={"icon"} variant="secondary" className="rounded-full" onClick={handleGoBack}>
                <ChevronLeftIcon></ChevronLeftIcon>
            </Button>
            <div className="flex items-center gap-3">
                <ScrollTextIcon></ScrollTextIcon>
                <h2 className="text-lg font-semibold">Meus Pedidos</h2>

            </div>
            {orders.map((order) => (
                <Card key={order.id} >

                    <CardContent className="space-y-4 py-5">
                        <div
                            className={`w-fit rounded-full px-2 py-1 text-xs font-semibold
                                 ${([OrderStatus.PAYMENT_CONFIRMED, OrderStatus.FINISHED] as OrderStatus[]).includes(order.status) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"} `}>
                            {getStatusLabel(order.status)}
                        </div>

                        <div className="flex items-center gap-2">
                            <div>
                                <Image src={order.restaurant.avatarImageUrl} alt={order.restaurant.name} width={20} height={20} className="rounded-sm" />
                            </div>
                            <p className="text-sm font-semibold">{order.restaurant.name}</p>
                        </div>

                        <Separator />
                        <div className="space-y-2">
                            {order.orderProducts.map((order) => (
                                <div key={order.id} className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs ">
                                        {order.quantity}
                                    </div>
                                    <p className="text-sm font-semibold">{order.product.name}</p>
                                </div>
                            ))}
                        </div>

                        <Separator />
                            <div className="flex  justify-between">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-sm font-semibold">
                                    {formatCurrency(order.total)}
                                </p>
                            </div>
                    </CardContent>
                </Card>
            ))}

        </div>
    );
}

export default OrderList;