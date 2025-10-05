
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useContext } from "react";
import { CartContext } from "../contexts/cart";
import CartItem from "../[productId]/components/cart-items";
import { Button } from "@/components/ui/button";

const CartSheet = () => {
    const { isOpen, toggleCart, products } = useContext(CartContext);
    return (

        <Sheet open={isOpen} onOpenChange={toggleCart}>
            <SheetContent className="w-[80%]">
                <SheetHeader>
                    <SheetTitle className="text-left">Sacola</SheetTitle>

                </SheetHeader>
                <div className="py-5 flex flex-col gap-5 h-full">
                   <div className="flex-auto">
                     {products.map((product) => (
                        <CartItem key={product.id} product={product} />
                    ))}
                   </div>

                    <Button className="w-full rounded-full">Finalizar pedido</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default CartSheet;