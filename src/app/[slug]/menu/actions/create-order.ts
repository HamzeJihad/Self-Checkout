'use server';

import { ConsumptionMethod } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getRestaurantBySlug } from '@/data/get-restaraunt-by-slug';
import { removeCpfPunctuation } from '@/helpers/cpf';
import { db } from '@/lib/prisma';

interface CreateOrderInput {
    customerName: string;
    customerCpf: string;
    consumptionMethod: ConsumptionMethod;
    slug: string;
    products: { id: string; price: number; quantity: number }[];
}

export const createOrder = async (data: CreateOrderInput) => {
    const productsWithPrice = await db.product.findMany({
        where: {
            id: {
                in: data.products.map((product) => product.id),
            },
        },
        select: {
            id: true,
            price: true,
        },
    });

    const restaurant = await getRestaurantBySlug(data.slug);

   await db.order.create({
        data: {
            total: data.products.reduce((acc, product) => {
                const productWithPrice = productsWithPrice.find((p) => p.id === product.id);
                return acc + (productWithPrice?.price || 0) * product.quantity;
            }, 0),
            status: 'PENDING',
            consumptionMethod: data.consumptionMethod,
            restaurant: {
                connect: {
                    id: restaurant?.id,
                },
            },
            orderProducts: {
                create: data.products.map((product) => {
                    const productWithPrice = productsWithPrice.find((p) => p.id === product.id);
                    return {
                        product: {
                            connect: {
                                id: product.id,
                            },
                        },
                        quantity: product.quantity,
                        price: productWithPrice?.price || 0,
                    };
                }),
            },
            customerName: data.customerName,
            customerCpf: removeCpfPunctuation(data.customerCpf),
        },
    });
    revalidatePath(`/${data.slug}/orders`);
    redirect(`/${data.slug}/orders?cpf=${removeCpfPunctuation(data.customerCpf)}`);
}

