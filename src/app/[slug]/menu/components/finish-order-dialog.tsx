
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConsumptionMethod } from "@prisma/client"
import { Loader2Icon } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { useContext, useTransition } from "react"
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { isValidCpf } from "@/helpers/cpf";

import { createOrder } from "../actions/create-order"
import { CartContext } from "../contexts/cart"

const formSchema = z.object({
    name: z.string().trim().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
    cpf: z.string().trim().min(11, { message: "O CPF deve ter 11 dígitos" }).refine((cpf) => {
        return isValidCpf(cpf);
    }, { message: "Digite um CPF válido" }),
});

type FormSchema = z.infer<typeof formSchema>;



interface FinishOrderDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const FinishOrderDialog = ({ isOpen, onOpenChange }: FinishOrderDialogProps) => {
    const searchParams = useSearchParams();
    const { products } = useContext(CartContext);
    const { slug } = useParams<{ slug: string }>();
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        shouldUnregister: true,
    })
    const onSubmit = async (data: FormSchema) => {
        try {
            const consumptionMethod = searchParams.get("consumptionMethod") as ConsumptionMethod;
            startTransition(async () => {
                await createOrder({
                    customerName: data.name,
                    customerCpf: data.cpf,
                    consumptionMethod: consumptionMethod,
                    slug: slug,
                    products: products
                });
                onOpenChange(false);
                toast.success("Pedido realizado com sucesso!");
            });


        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Confirmação de Pedido</DrawerTitle>
                    <DrawerDescription>Insira suas informações abaixo para finalizar o pedido</DrawerDescription>
                </DrawerHeader>
                <div className="p-5">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Seu nome" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF</FormLabel>
                                        <FormControl>
                                            <PatternFormat format="###.###.###-##" placeholder="Digite seu CPF"
                                                customInput={Input} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DrawerFooter>
                                <Button type="submit" className="w-full rounded-full" disabled={isPending}>
                                    {isPending && <Loader2Icon className="mr-2 animate-spin" />}
                                    Confirmar
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="w-full rounded-full">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
                </div>

            </DrawerContent>
        </Drawer>
    );
}

export default FinishOrderDialog;