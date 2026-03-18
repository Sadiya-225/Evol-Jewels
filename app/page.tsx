"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { Sparkles, Heart, Target, Lightbulb, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import Skeleton from "@/components/ui/Skeleton";

const brandValues = [
  {
    icon: Target,
    value: "Clarity",
    description: "We move with precision in thought, design, and every decision",
  },
  {
    icon: Lightbulb,
    value: "Creativity",
    description: "We shape taste without chasing trends",
  },
  {
    icon: Heart,
    value: "Commitment",
    description: "We deliver with consistency and excellence, every time",
  },
  {
    icon: Sparkles,
    value: "Curiosity",
    description: "We ask better questions and think deeply about answers",
  },
  {
    icon: Shield,
    value: "Character",
    description: "Integrity and authenticity guide us in everything we do",
  },
];

export default function Home() {
  const { data: categoriesData, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: featuredProductsData, isLoading: productsLoading } = trpc.products.featured.useQuery({ limit: 4 });

  const categories = categoriesData || [];
  const featuredProducts = featuredProductsData?.map((p) => ({
    ...p.product,
    category: p.category,
  })) || [];

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero */}
      <section className="min-h-screen bg-evol-off-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl w-full flex flex-col items-center text-center space-y-8"
        >
          {/* Hero Product Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-md aspect-square bg-evol-grey/20 flex items-center justify-center text-evol-metallic"
          >
            <Image
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"
              alt="Hero Product"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-serif text-6xl md:text-8xl text-evol-dark-grey"
          >
            Begin.
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="font-script text-2xl md:text-3xl text-evol-dark-grey"
          >
            Love begins with you.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-4 md:mb-8 lg:mb-16"
          >
            <Link href="/shop">
              <Button variant="primary">Discover Your Piece</Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Collections Grid */}
      <section className="bg-evol-light-grey py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey text-center mb-12"
          >
            Collections
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {categoriesLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-8 w-32 mx-auto mt-4" />
                </div>
              ))
            ) : (
              categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] bg-evol-grey overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                      {category.image && (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:-translate-y-1"
                        />
                      )}
                    </div>
                    <h3 className="font-serif text-2xl text-evol-dark-grey mt-4 text-center">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Brand Statement */}
      <section className="relative bg-evol-off-white py-32 md:py-48 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.08] select-none pointer-events-none">
          <div className="absolute inset-0 flex flex-wrap items-center justify-center transform -rotate-12 scale-150">
            {Array.from({ length: 20 }).map((_, i) => (
              <p
                key={i}
                className="font-script text-4xl text-evol-grey whitespace-nowrap px-8 py-4"
              >
                Love begins with you.
              </p>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <blockquote className="font-serif text-3xl md:text-5xl leading-relaxed text-evol-dark-grey">
            "To learn to love ourselves, so we can love another."
          </blockquote>
        </motion.div>
      </section>

      {/* Section 4: Featured Products */}
      <section className="bg-white py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey text-center mb-12"
          >
            Featured Pieces
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="aspect-square w-full mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <Link href={`/shop/${product.id}`}>
                    <div className="relative aspect-square bg-evol-light-grey overflow-hidden mb-4">
                      {product.images && product.images.length > 0 && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:-translate-y-1"
                        />
                      )}
                      {product.isFeatured && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="promotional">Featured</Badge>
                        </div>
                      )}
                    </div>

                    <h3 className="font-sans text-sm font-medium text-evol-dark-grey mb-1">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-evol-dark-grey mb-3">
                      ₹{parseFloat(product.basePrice).toLocaleString("en-IN")}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.category && (
                        <Badge variant="default">
                          {product.category.name}
                        </Badge>
                      )}
                    </div>

                    <Button variant="secondary" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center mt-12"
          >
            <Link href="/shop">
              <Button variant="secondary">Explore All</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Brand Values Strip */}
      <section className="bg-evol-light-grey py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey text-center mb-16"
          >
            Our 5Cs
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6">
            {brandValues.map((value, index) => (
              <motion.div
                key={value.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="h-12 w-12 flex items-center justify-center text-evol-red">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-evol-dark-grey">
                  {value.value}
                </h3>
                <p className="font-body text-sm text-evol-metallic leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Newsletter CTA */}
      <section className="bg-evol-dark-grey py-20 md:py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-white">
            Love begins with knowing yourself.
          </h2>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email"
              className="flex-1 border-white text-white placeholder:text-evol-grey focus:border-evol-red"
            />
            <Button variant="primary" type="submit">
              Subscribe
            </Button>
          </form>

          <p className="font-body text-xs text-evol-grey">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
