"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Sparkles, Heart, Target, Lightbulb, Shield } from "lucide-react";

const brandManifesto = [
  "It begins with me. It begins with you.",
  "To see the world with compassion and clarity.",
  "To walk the path that feels true.",
  "To give fully, and deliver with intention.",
  "To ask boldly, and listen with an open mind.",
  "To remain steady in a shifting world.",
  "To stand with integrity, rooted in who we are.",
  "To learn to love ourselves, so we can love another.",
  "It begins with me. It begins with you.",
];

const brandValues = [
  {
    icon: Target,
    number: "01",
    value: "Clarity",
    description:
      "We move with precision and deliberation-in thought, in design, in every decision. Clarity is our constant. It shapes what we create, how we communicate, and how we decide.",
  },
  {
    icon: Lightbulb,
    number: "02",
    value: "Creativity",
    description:
      "We shape taste without chasing trends-doing better, not more, finding the new in the familiar. Evol creates restrained designs that feel relevant today and timeless tomorrow.",
  },
  {
    icon: Heart,
    number: "03",
    value: "Commitment",
    description:
      "We deliver with consistency and excellence, every time. Commitment is our quiet promise-grounded in ownership, discipline, and follow-through.",
  },
  {
    icon: Sparkles,
    number: "04",
    value: "Curiosity",
    description:
      "We ask better questions. Curiosity keeps Evol evolving-open-minded, discerning, and guided by clear standards.",
  },
  {
    icon: Shield,
    number: "05",
    value: "Character",
    description:
      "Integrity and authenticity guide us. Character earns trust, through consistency, respect, and care for the buyer. We do the right thing, even when it's harder.",
  },
];

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-evol-dark-grey">
            Love begins with you
          </h1>
          <p className="font-body text-lg md:text-xl text-evol-metallic leading-relaxed max-w-3xl mx-auto">
            We design jewellery as compositions, thoughtful pieces that express who you
            are, and who you're growing into.
          </p>
        </motion.div>
      </section>

      {/* Brand Statement */}
      <section className="bg-evol-off-white py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey text-center mb-12">
              Our Manifesto
            </h2>

            {brandManifesto.map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`${
                  index === 0 || index === brandManifesto.length - 1
                    ? "font-serif text-2xl md:text-3xl text-evol-dark-grey"
                    : "font-body text-lg md:text-xl text-evol-metallic"
                } text-center leading-relaxed`}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="font-sans text-xs uppercase tracking-widest text-evol-red">
                Mission
              </h3>
              <p className="font-body text-lg text-evol-dark-grey leading-relaxed">
                We design jewellery as compositions, thoughtful pieces that express who
                you are, and who you're growing into.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="font-sans text-xs uppercase tracking-widest text-evol-red">
                Vision
              </h3>
              <p className="font-body text-lg text-evol-dark-grey leading-relaxed">
                To reclaim love as something you give yourself first.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Photography Placeholder */}
      <section className="bg-evol-light-grey py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="aspect-[2/3] bg-evol-grey/30 flex items-center justify-center"
              >
                <span className="font-body text-sm text-evol-metallic">
                  Brand Photography {i}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The 5Cs */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-evol-dark-grey mb-4">
              Our 5Cs
            </h2>
            <p className="font-body text-evol-metallic">
              Just like the 4Cs of diamonds, our 5Cs are reflected in all our actions
            </p>
          </motion.div>

          <div className="space-y-20">
            {brandValues.map((value, index) => (
              <motion.div
                key={value.value}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                {/* Number & Icon */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-4">
                  <span className="font-serif text-6xl md:text-8xl text-evol-light-grey">
                    {value.number}
                  </span>
                  <div className="h-16 w-16 flex items-center justify-center text-evol-red">
                    <value.icon className="h-12 w-12" />
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-9 space-y-4">
                  <h3 className="font-sans text-2xl font-bold uppercase tracking-wider text-evol-dark-grey">
                    {value.value}
                  </h3>
                  <p className="font-body text-lg text-evol-metallic leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Proposition */}
      <section className="bg-evol-off-white py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <p className="font-body text-lg md:text-xl text-evol-dark-grey leading-relaxed">
              In knowing yourself, you make space for real connection.
            </p>
            <p className="font-body text-lg md:text-xl text-evol-dark-grey leading-relaxed">
              In loving yourself, you invite love in.
            </p>
            <p className="font-body text-lg md:text-xl text-evol-dark-grey leading-relaxed">
              Evol exists to honour that journey, crafting modern pieces that reflect
              clarity, balance, and the beauty of being true to oneself.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
