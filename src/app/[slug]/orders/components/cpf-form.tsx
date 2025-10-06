
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
} from "@/components/ui/drawer"
import { isValidCpf, removeCpfPunctuation } from "@/helpers/cpf";
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
import { usePathname, useRouter } from "next/navigation"

const formSchema = z.object({
    cpf: z.string().trim().min(1, { message: "O CPF é obrigatório e deve ter 11 dígitos" }).refine((cpf) => {
        return isValidCpf(cpf);
    }, { message: "Digite um CPF válido" }),
});
type FormSchema = z.infer<typeof formSchema>;




const CpfForm = () => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        shouldUnregister: true,
    })
    const pathname = usePathname();
    const router = useRouter();

    const onSubmit = async (data: FormSchema) => {
        router.push(`${pathname}?cpf=${removeCpfPunctuation(data.cpf)}`)
    }
    return (
        <Drawer open >
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Visualizar Pedidos</DrawerTitle>
                    <DrawerDescription>Insira seu CPF abaixo para visualizar seus pedidos</DrawerDescription>
                </DrawerHeader>
                <div className="p-5">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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
                                <Button type="submit" className="w-full rounded-full" >
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

export default CpfForm;