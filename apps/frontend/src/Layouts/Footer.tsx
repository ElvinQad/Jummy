import React from 'react';
import { Facebook, Twitter, Linkedin, Video, Phone, Mail, MapPin, LucideIcon } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

interface MenuItem {
  label: string;
  href: string;
}

interface SocialLink {
  Icon: LucideIcon;
  href: string;
  color: string;
  label: string;
}

interface ContactInfo {
  Icon: LucideIcon;
  text: string;
  href: string;
}

const Footer: React.FC = () => {
  const menuItems: MenuItem[] = [
    { label: 'Home', href: '#' },
    { label: 'How it works?', href: '#' },
    { label: 'Menus', href: '#' },
    { label: 'Chefs', href: '#' },
    { label: 'Recipes', href: '#' },
    { label: 'Contact', href: '#' }
  ];

  const socialLinks: SocialLink[] = [
    { Icon: Facebook, href: '#', color: '#3b5998', label: 'Facebook' },
    { Icon: Twitter, href: '#', color: '#55acee', label: 'Twitter' },
    { Icon: Linkedin, href: '#', color: '#007bb5', label: 'LinkedIn' },
    { Icon: Video, href: '#', color: '#3b5998', label: 'Video' }
  ];

  const contactInfo: ContactInfo[] = [
    { Icon: Phone, text: '+1 234 567 890', href: 'tel:+1234567890' },
    { Icon: Mail, text: 'info@mezban.com', href: 'mailto:info@mezban.com' },
    { Icon: MapPin, text: '123 Food Street, Kitchen City, FC 12345', href: '#' },
  ];

  return (
    <footer className="relative w-full bg-background">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-95 dark:opacity-10"
        style={{
          backgroundImage: "url('public/assets/images/header/bg-shape.png')",
          backgroundColor: "var(--background)",
          backgroundBlendMode: "overlay"
        }}
      />

      <div className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start space-y-20">
              <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
                <a href="/">
                  <img src="/src/assets/LogoNamed.svg" alt="Footer Logo" className="h-60 w-auto" />
                </a>
              </Button>
              <p className="text-foreground text-base leading-relaxed text-center md:text-left">
                Discover the finest culinary experiences with Mezban. Your journey to exceptional taste begins here.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-foreground font-bold text-xl mb-8">Quick Links</h3>
              <nav>
                <ul className="space-y-4">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a 
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-base"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-foreground font-bold text-xl mb-8">Contact Us</h3>
              <ul className="space-y-5">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <item.Icon className="text-foodred-600" size={20} />
                    <a 
                      href={item.href}
                      className="text-foodred-700 hover:text-foodred-900 transition-colors text-base"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-foreground font-bold text-xl mb-8">Follow Us</h3>
              <div className="flex flex-wrap gap-5">
                {socialLinks.map(({ Icon, href, label }, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="icon"
                    asChild
                    className="rounded-full bg-foodred-600 hover:bg-foodred-700 transition-all hover:scale-110"
                  >
                    <a
                      href={href}
                      className="text-white hover:text-foodred-100"
                      aria-label={label}
                    >
                      <Icon size={22} />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Footer Bottom */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="text-base">
              © {new Date().getFullYear()}{' '}
              <Button variant="link" className="px-1 text-foodred-700 font-semibold h-auto p-0 hover:text-foodred-900">
                <span>Jummy</span>
              </Button>{' '}
              Design by{' '}
              <Button variant="link" className="px-1 text-foodred-700 font-semibold h-auto p-0 hover:text-foodred-900">
                <span>ElvinQad</span>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;