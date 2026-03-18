import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Rings", href: "/shop?category=rings" },
    { label: "Necklaces", href: "/shop?category=necklaces" },
    { label: "Earrings", href: "/shop?category=earrings" },
    { label: "Bracelets", href: "/shop?category=bracelets" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Store Locator", href: "/stores" },
    { label: "Care Guide", href: "/care" },
    { label: "Customisation", href: "/customisation" },
  ],
  connect: [
    { label: "sadiya.siddiqui@evoljewels.com", href: "mailto:sadiya.siddiqui@evoljewels.com" },
    { label: "Banjara Hills, Hyderabad", href: "/stores" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/evoljewels", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/evoljewels", label: "Facebook" },
  { icon: Mail, href: "mailto:sadiya.siddiqui@evoljewels.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-evol-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="space-y-20">
            <Link href="/">
              <Image
                src="/logos/Evol Jewels Logo - Black.png"
                alt="Evol Jewels"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="font-script text-lg text-evol-dark-grey">
              Love begins with you.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey font-medium mb-4">
              Shop
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-evol-metallic hover:text-evol-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey font-medium mb-4">
              About
            </h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-evol-metallic hover:text-evol-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-evol-dark-grey font-medium mb-4">
              Connect
            </h3>
            <ul className="space-y-2 mb-4">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-evol-metallic hover:text-evol-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-evol-metallic hover:text-evol-red transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-evol-grey">
          <p className="text-center font-sans text-xs text-evol-metallic">
            © {new Date().getFullYear()} Evol Jewels. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
