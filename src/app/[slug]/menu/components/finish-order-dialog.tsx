
"use client"
import { Button } from "@/components/ui/button"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PatternFormat } from "react-number-format"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { isValidCpf } from "@/helpers/cpf";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

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
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        shouldUnregister: true,
    })
    const onSubmit = (data: FormSchema) => {
        console.log(data);
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
                                <Button type="submit" className="w-full rounded-full">Confirmar</Button>
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