import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Car, Calendar, Gauge, MapPin, Eye, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContactModal } from '@/components/ContactModal';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  location: string;
  image_url: string;
  title: string;
  description: string;
  is_available: boolean;
}

export const Vehicles: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterAndSortCars();
  }, [cars, searchTerm, makeFilter, conditionFilter, sortBy]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vehicles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCars = () => {
    let filtered = cars.filter(car => {
      const matchesSearch = !searchTerm || 
        car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMake = !makeFilter || makeFilter === 'all' || car.make === makeFilter;
      const matchesCondition = !conditionFilter || conditionFilter === 'all' || car.condition === conditionFilter;

      return matchesSearch && matchesMake && matchesCondition;
    });

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'year-desc':
          return (b.year || 0) - (a.year || 0);
        case 'year-asc':
          return (a.year || 0) - (b.year || 0);
        case 'mileage-asc':
          return (a.mileage || 0) - (b.mileage || 0);
        default:
          return 0;
      }
    });

    setFilteredCars(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const handleContactClick = (car: Car) => {
    setSelectedCar(car);
    setContactModalOpen(true);
  };

  const uniqueMakes = [...new Set(cars.map(car => car.make).filter(Boolean))];
  const uniqueConditions = [...new Set(cars.map(car => car.condition).filter(Boolean))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="car-card animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold text-gradient mb-4">Premium Vehicle Collection</h1>
        <p className="text-muted-foreground text-lg">Discover exceptional automobiles crafted for the discerning driver</p>
      </div>

      {/* Filters */}
      <Card className="mb-8 bg-card/95 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="luxury-input pl-10"
              />
            </div>

            {/* Make Filter */}
            <Select value={makeFilter} onValueChange={setMakeFilter}>
              <SelectTrigger className="luxury-input">
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {uniqueMakes.map((make) => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Condition Filter */}
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="luxury-input">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {uniqueConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="luxury-input">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="year-desc">Year: Newest First</SelectItem>
                <SelectItem value="year-asc">Year: Oldest First</SelectItem>
                <SelectItem value="mileage-asc">Mileage: Low to High</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              onClick={() => {
                setSearchTerm('');
                setMakeFilter('all');
                setConditionFilter('all');
                setSortBy('price-asc');
              }}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredCars.length} of {cars.length} vehicles
        </p>
      </div>

      {/* Vehicle Grid */}
      {filteredCars.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No vehicles found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car, index) => (
            <Card key={car.id} className="car-card group" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                {car.image_url ? (
                  <img
                    src={car.image_url}
                    alt={car.title || `${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Car className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">{car.condition}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Title and Price */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
                      {car.title || `${car.make} ${car.model}`}
                    </h3>
                    <p className="text-2xl font-bold text-accent">
                      {car.price ? formatPrice(car.price) : 'Price on request'}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {car.year && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{car.year}</span>
                      </div>
                    )}
                    {car.mileage && (
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{formatMileage(car.mileage)} mi</span>
                      </div>
                    )}
                    {car.location && (
                      <div className="flex items-center space-x-2 col-span-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{car.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {car.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {car.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full premium-button hover:shadow-glow">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleContactClick(car)}
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Information Section */}
      <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Ready to Drive Your Dream Car?</h2>
          <p className="text-lg text-foreground mb-6">
            For more enquiries or to arrange a purchase, we're here to help
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-4 bg-background/60 rounded-lg border border-border/50">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Call Us</p>
                <a href="tel:+254704400418" className="text-primary hover:underline text-lg font-medium">
                  0704-400-418
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-background/60 rounded-lg border border-border/50">
              <div className="h-5 w-5 text-primary">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-foreground">Email Us</p>
                <a href="mailto:kevinbebington9@gmail.com" className="text-primary hover:underline text-lg font-medium">
                  kevinbebington9@gmail.com
                </a>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            Our team is ready to assist you with any questions about our premium vehicle collection
          </p>
        </CardContent>
      </Card>

      {/* Contact Modal */}
      {selectedCar && (
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          carTitle={selectedCar.title || `${selectedCar.make} ${selectedCar.model}`}
        />
      )}
    </div>
  );
};