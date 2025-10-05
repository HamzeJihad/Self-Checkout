'use client'
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/format-currency";
import { Prisma, Product, Restaurant } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/cart";
import CartSheet from "../../components/cart-sheet";
interface ProductDetailsProps {
    product:   Prisma.ProductGetPayload<{
        include: { restaurant: {
            select: { name: true, avatarImageUrl: true }
        } }
    }>;
}
const ProductDetails = ({ product }: ProductDetailsProps) => {
    const {toggleCart, addProduct } = useContext(CartContext);
    const [quantity, setQuantity] = useState<number>(1);
    const handleDecreaseQuantity = () => {
        if(quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };
    const handleIncreaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleAddToCart = () => {
        addProduct?.({...product, quantity});
        toggleCart();
    }
    return (  
        <>
        <div className="relative rounded-t-3xl py-5 mt-[-1.5rem] bg-white px-5 flex flex-auto flex-col  overflow-hidden">
              
              <div className="flex-auto  overflow-hidden">
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
                
               <ScrollArea className="h-full">
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
                    <ul className="list-disc px-5 text-sm text-muted-foreground">
                        {product.ingredients.map((ingredient) => (
                            <li key={ingredient}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
               </ScrollArea>
              </div>

                <Button className="rounded-full w-full" onClick={handleAddToCart}>Adicionar à sacola</Button>
        </div>
                        
            <CartSheet></CartSheet>
        </>
    );
}
 
export default ProductDetails;