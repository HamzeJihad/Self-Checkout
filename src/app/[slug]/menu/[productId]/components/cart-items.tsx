'use client';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext, CartProduct } from "../../contexts/cart";
interface CartItemProps {
    product: CartProduct;
}

const CartItem = ({ product }: CartItemProps) => {
    const { decreaseProductQuantity, increaseProductQuantity, removeProduct } = useContext(CartContext);
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* ESQUERDA */}
                <div className="relative h-20 w-20 rounded-xl bg-gray-200">
                    <Image src={product.imageUrl} alt={product.name} fill />
                </div>
                <div className="space-y-1">
                    <p className="text-xs max-w-[90%] truncate text-ellipsis ">{product.name}</p>
                    <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                    {/* QUANTIDADE */}
                    <div className="flex items-center gap-1">
                        <Button variant='outline' className="rounded-xl h-8 w-8" onClick={() => decreaseProductQuantity?.(product.id)}><ChevronLeftIcon /></Button>
                        <div className="w-4">{product.quantity}</div>
                        <Button variant='destructive' className="rounded-xl h-8 w-8" onClick={() => increaseProductQuantity?.(product.id)}><ChevronRightIcon /></Button>
                    </div>
                </div>
            </div>
            <Button className="h-7 w-7 rounded-lg" variant="outline" onClick={() => removeProduct?.(product.id)}>
                <TrashIcon></TrashIcon>
            </Button>
        </div>
    );
}

export default CartItem;