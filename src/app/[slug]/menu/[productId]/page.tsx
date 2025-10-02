import { db } from "@/lib/prisma";
import { notFound,  } from "next/navigation";
import Image from "next/image";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductHeader from "./components/product-header";
import ProductDetails from "./components/product-details";

interface ProductPageProps {
    params: {
        productId: string;
        slug: string;
    };
}

const ProductPage = async ({ params }: ProductPageProps) => {
    const { slug,  productId } = await params;
    const product = await db.product.findUnique({
        where: {
            id: productId,
        },
        include: {
           restaurant: {
            select: { name: true, avatarImageUrl: true, slug: true }
           }
    }});
    
    if(!product) {
        return notFound();
    }
    if(product.restaurant.slug.toUpperCase() !== slug.toUpperCase()) {
        return notFound();
    }

    return ( 
        <div className="flex h-full flex-col">
            <ProductHeader product={product} />
            <ProductDetails product={product} />
        </div> 
    );
}

 
export default ProductPage;