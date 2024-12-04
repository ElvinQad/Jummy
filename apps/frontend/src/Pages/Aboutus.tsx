'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Clock, Users, ChefHat, Star, Shield, Search } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-16">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl font-bold text-foodred-600">Experience the Magic of Home Cooking</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Join our thriving community where passionate home chefs transform everyday meals into extraordinary dining experiences. Discover authentic flavors that tell a story.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item} className="text-center">
            <div className="text-3xl font-bold text-foodred-600">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ServiceCard 
          icon={Users}
          title="Join Our Food-Loving Family"
          description="Begin your culinary journey in seconds. Join thousands of food enthusiasts who've already discovered their perfect dining experience."
          features={["Instant Access", "Personalized Experience", "Community Perks"]}
        />
        
        <ServiceCard 
          icon={ChefHat}
          title="Empower Local Culinary Artists"
          description="Turn your kitchen into a thriving business. Our verified chefs earn an average of 40% more than traditional platforms."
          features={["Elite Chef Status", "Growth Tools", "Success Support"]}
        />

        <ServiceCard 
          icon={Clock}
          title="Savor Restaurant-Quality Meals at Home"
          description="Experience the convenience of gourmet dining without leaving your comfort zone. Every meal tells a unique story."
          features={["Handcrafted Meals", "Live Updates", "Doorstep Magic"]}
        />

        <ServiceCard 
          icon={Search}
          title="Discover Your Perfect Meal"
          description="Our smart matching system learns your taste preferences to suggest dishes you'll love. Never settle for ordinary again."
          features={["Smart Recommendations", "Taste Matching", "Local Gems"]}
        />

        <ServiceCard 
          icon={Shield}
          title="Stress-Free Dining Experience"
          description="Focus on enjoying your meal while we handle everything else. Your satisfaction is our top priority."
          features={["Worry-Free Payments", "Money-Back Guarantee", "24/7 Support"]}
        />

        <ServiceCard 
          icon={Star}
          title="Join Our Hall of Fame"
          description="Be part of our transparent community where every review shapes the future of home dining. Your voice matters."
          features={["Verified Reviews", "Recognition System", "Impact Points"]}
        />
      </motion.div>
    </div>
  )
}

const stats = [
  { value: '50,000+', label: 'Happy Food Lovers' },
  { value: '1,200+', label: 'Master Home Chefs' },
  { value: '100,000+', label: 'Magical Meals Served' },
  { value: '4.9', label: 'Customer Delight Score' },
]

const ServiceCard = ({ icon: Icon, title, description, features }: {
  icon: React.ElementType
  title: string
  description: string
  features: string[]
}) => (
  <motion.div variants={item}>
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="w-10 h-10 rounded-full bg-foodred-50 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-foodred-600" />
        </div>
        <CardTitle className="text-xl text-foodred-600">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="outline" className="bg-cuisine-50">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
)