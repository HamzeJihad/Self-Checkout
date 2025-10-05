'use client';

import { Product } from "@prisma/client";
import { createContext, useState } from "react";

export interface CartProduct extends Product {
    quantity: number;
}


export interface ICartContext {
    isOpen: boolean;
    products: CartProduct[];
    toggleCart: () => void;
    addProduct?: (product: CartProduct) => void;
    decreaseProductQuantity?: (productId: string) => void;
    increaseProductQuantity?: (productId: string) => void;
    removeProduct?: (productId: string) => void;

}

export const CartContext = createContext<ICartContext>({
    isOpen: false,
    products: [],
    toggleCart: () => { },
    addProduct: () => { },
    decreaseProductQuantity: () => { },
    increaseProductQuantity: () => { },
    removeProduct: () => { },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const addProduct = (product: CartProduct) => {
        setProducts((prev) => {
            const existingProduct = prev.find((p) => p.id === product.id);
            if (existingProduct) {
                return prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + product.quantity } : p);
            } else {
                return [...prev, product];
            }
        });
    }

    const decreaseProductQuantity = (productId: string) => {
        setProducts((prev) => {
            const existingProduct = prev.find((p) => p.id === productId);
            if (existingProduct && existingProduct.quantity > 1) {
                return prev.map((p) => p.id === productId ? { ...p, quantity: p.quantity - 1 } : p);
            } else {
                return prev.filter((p) => p.id !== productId);
            }
        });
    }

    const increaseProductQuantity = (productId: string) => {
      setProducts((prev) => {
            const existingProduct = prev.find((p) => p.id === productId);
            if (existingProduct) {
                return prev.map((p) => p.id === productId ? { ...p, quantity: p.quantity + 1 } : p);
            } else {
                return prev.filter((p) => p.id !== productId);
            }
        });
    }

    const removeProduct = (productId: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
        return (
            <CartContext.Provider value={{
                isOpen,
                products,
                toggleCart,
                addProduct,
                decreaseProductQuantity,
                increaseProductQuantity,
                removeProduct
            }}>
                {children}
            </CartContext.Provider>
        );
    }
