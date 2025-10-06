import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { formatCurrency } from "@/helpers/format-currency";

interface ProductsListProps {
   products: Product[];
}

const ProductsList = ({ products }: ProductsListProps) => {
    const {slug} = useParams<{slug: string}>();
    const searchParams = useSearchParams();
    const consumptionMethod = searchParams.get("consumptionMethod");
    return (
        <div className="space-y-3 px-4">
            {products.map((product) => (
               <Link href={`/${slug}/menu/${product.id}?consumptionMethod=${consumptionMethod}`} key={product.id} className="flex items-center justify-between gap-10, py-3 border-b">
                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                    <p className="mt-1 text-sm font-semibold text-green-600">{formatCurrency(product.price)}</p>
                  </div>


                  <div className="relative min-h-[82px] min-w-[120px]">
                    <Image src={product.imageUrl} alt={product.name} layout="fill"  className="rounded-lg object-contain" />
                  </div>
               </Link>
            ))}
        </div>
    );
}

export default ProductsList;