
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useContext, useState } from "react";
import { CartContext } from "../contexts/cart";
import CartItem from "../[productId]/components/cart-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";


import FinishOrderButton from "./finish-order-dialog";
const CartSheet = () => {
    const { isOpen, toggleCart, products } = useContext(CartContext);
    const [finishOrderDialogIsOpen, setFinishOrderDialogIsOpen] = useState(false);
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
                    <Card className="pt-4 mb-4">

                        <CardContent>
                            <div className="flex  justify-between ">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-sm font-semibold">
                                    {products.reduce((acc, product) => acc + product.price * product.quantity, 0).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </p>
                            </div>

                        </CardContent>
                    </Card>
                    <Button className="w-full rounded-full" onClick={() => setFinishOrderDialogIsOpen(true)}>Finalizar pedido</Button>
                    <FinishOrderButton isOpen={finishOrderDialogIsOpen} onOpenChange={setFinishOrderDialogIsOpen} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default CartSheet;