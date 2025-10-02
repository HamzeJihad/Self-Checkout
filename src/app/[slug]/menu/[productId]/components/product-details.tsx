'use client'
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";
import { Prisma, Product, Restaurant } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRight, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface ProductDetailsProps {
    product:   Prisma.ProductGetPayload<{
        include: { restaurant: {
            select: { name: true, avatarImageUrl: true }
        } }
    }>;
}
const ProductDetails = ({ product }: ProductDetailsProps) => {
    const [quantity, setQuantity] = useState<number>(1);
    const handleDecreaseQuantity = () => {
        if(quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };
    const handleIncreaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    return (  
        <div className="relative rounded-t-3xl py-5 mt-[-1.5rem] bg-white px-5 flex-auto flex-col">
              
              <div className="flex-auto">
                  { /* Restaurant Info */ }
                <div className="flex items-center gap-1">
                    <Image src={product.restaurant.avatarImageUrl} alt={product.restaurant.name} width={16} height={16} className="rounded-full"  />
                    <p className="text-xs text-muted-foreground">{product.restaurant.name}</p>
                </div>

                { /* Product Info */ }
                <h2 className="text-xl font-semibold mt-1">{product.name}</h2>
                <div className="flex flex-items-center justify-between mt-2">
                    <h3 className="text-xl font-semibold">{formatCurrency(product.price)}</h3>
                    
                    <div className="flex items-center gap-3">
                      <Button variant='outline' className="rounded-xl h-8 w-8" onClick={handleDecreaseQuantity}><ChevronLeftIcon /></Button>
                    <div className="w-4">{quantity}</div>
                    <Button variant='destructive' className="rounded-xl h-8 w-8" onClick={handleIncreaseQuantity}><ChevronRightIcon /></Button>

                    </div>
                </div>
                
                { /* Product Description */ }
                <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Sobre</h4>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>


                { /* Product Ingredients */ }
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-1">
                        <ChefHatIcon size={18} />
                        <h4 className="font-semibold">Ingredientes</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.ingredients.join(", ")}</p>
                </div>
              </div>

                <Button className="rounded-full w-full mt-6">Adicionar à sacola</Button>
                

        </div>
    );
}
 
export default ProductDetails;