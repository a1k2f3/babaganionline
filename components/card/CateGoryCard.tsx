// components/card/CategoryCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  slug,
  imageUrl,
  productCount,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
        <Link href={`/categories/${slug}`} className="block">
          
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 280px"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Product Count Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg"
        >
          <div className="flex items-center gap-1 text-gray-800 text-sm font-medium">
            <ShoppingBag size={14} />
            <span>{productCount}</span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
          <motion.h3
            whileHover={{ color: "#3B82F6" }}
            className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors"
            >
            {name}
          </motion.h3>
          
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="flex items-center text-gray-600 text-sm font-medium"
            >
            <span>Explore Collection</span>
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        
      </div>
            </Link>

      {/* Hover Effect Ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-blue-500/0 group-hover:bg-blue-500/5 pointer-events-none"
        animate={{ 
          scale: ["1", "1.02", "1"], 
          opacity: [0, 0.1, 0] 
        }}
        transition={{ 
          duration: 0.3, 
          times: [0, 0.5, 1] 
        }}
      />
    </motion.div>
  );
};

export default CategoryCard;