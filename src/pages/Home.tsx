import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Car, Users, Shield, Star, ArrowRight, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroBackgroundImage from '@/assets/bebington-hero-bg.jpg';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Car,
      title: 'Premium Vehicles',
      description: 'Curated collection of luxury and performance automobiles from trusted sellers.',
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Protected platform ensuring safe and reliable automotive transactions.',
      color: 'text-accent'
    },
    {
      icon: Users,
      title: 'Expert Community',
      description: 'Connect with automotive enthusiasts and certified dealers nationwide.',
      color: 'text-primary'
    },
    {
      icon: Star,
      title: 'Verified Quality',
      description: 'Every vehicle undergoes thorough verification for authenticity and condition.',
      color: 'text-accent'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Premium Vehicles' },
    { number: '50,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Verified Dealers' },
    { number: '99.9%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackgroundImage})` }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-slide-up">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Logo size="xl" className="animate-float" showText={true} />
            </div>

            {/* Hero text */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Premium 
              <span className="text-gradient block md:inline md:ml-4">
                Automotive
              </span>
              <span className="block">Experience</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover exceptional vehicles from trusted dealers and passionate enthusiasts. 
              Your journey to automotive excellence starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {user ? (
                <>
                  <Button
                    onClick={() => navigate('/vehicles')}
                    className="premium-button hover:shadow-glow text-lg px-8 py-4"
                    size="lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Browse Vehicles
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  {user.email === 'muturimichael66@gmail.com' && (
                    <Button
                      onClick={() => navigate('/add-car')}
                      variant="outline"
                      className="accent-button hover:shadow-accent text-lg px-8 py-4"
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      List Your Car
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="premium-button hover:shadow-glow text-lg px-8 py-4"
                  size="lg"
                >
                  <Car className="h-5 w-5 mr-2" />
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-white/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose <span className="text-gradient">Bebington Motors</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the pinnacle of automotive excellence with our premium platform designed for discerning car enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="car-card hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-smooth">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0ibTQwIDQwYy0xMS4wNDU2OTUgMC0yMC0yLjAyOTQzNy0yMC0yMHMyLjAyOTQzNy0yMCAyMC0yMGMxMS4wNDU2OTUgMCAyMC0yLjAyOTQzNyAyMC0yMHMyLjAyOTQzNy0yMCAyMC0yMGMxMS4wNDU2OTUgMCAyMCAxMS4wNDU2OTUgMjAgMjBzLTguOTU0MzA1IDIwLTIwIDIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Find Your 
              <span className="text-gradient block md:inline md:ml-4">
                Perfect Vehicle?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their dream cars through our premium platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <>
                  <Button
                    onClick={() => navigate('/vehicles')}
                    className="premium-button hover:shadow-glow text-lg px-8 py-4"
                    size="lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Explore Vehicles
                  </Button>
                  {user.email === 'muturimichael66@gmail.com' && (
                    <Button
                      onClick={() => navigate('/add-car')}
                      className="accent-button hover:shadow-accent text-lg px-8 py-4"
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Sell Your Car
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="premium-button hover:shadow-glow text-lg px-8 py-4"
                  size="lg"
                >
                  <Car className="h-5 w-5 mr-2" />
                  Join Today
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};