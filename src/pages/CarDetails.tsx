import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Gauge, MapPin, Phone, Settings, Car as CarIcon, Zap } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { ContactModal } from '@/components/ContactModal';

interface CarImage {
  id: string;
  image_url: string;
  description: string | null;
  display_order: number;
}

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
  transmission: string;
  engine_cc: number;
}

export const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', parseInt(id!))
        .single();

      if (error) throw error;
      setCar(data);

      // Fetch car images
      const { data: images, error: imagesError } = await supabase
        .from('car_images')
        .select('*')
        .eq('car_id', parseInt(id!))
        .order('display_order');

      if (imagesError) {
        console.error('Error fetching car images:', imagesError);
      } else {
        setCarImages(images || []);
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicle details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const formatEngineCC = (cc: number) => {
    return `${cc.toLocaleString()}cc`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4 w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <CarIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Vehicle not found</h3>
            <p className="text-muted-foreground mb-4">The vehicle you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/vehicles')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button 
        onClick={() => navigate('/vehicles')} 
        variant="outline" 
        className="mb-6 border-border hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Vehicles
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative">
              {carImages.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {carImages.map((image, index) => (
                      <CarouselItem key={image.id}>
                        <div className="relative h-96 lg:h-[500px]">
                          <img
                            src={image.image_url}
                            alt={image.description || `${car.title || `${car.make} ${car.model}`} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {image.description && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
                              <p className="text-sm">{image.description}</p>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {carImages.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              ) : car.image_url ? (
                <div className="relative h-96 lg:h-[500px]">
                  <img
                    src={car.image_url}
                    alt={car.title || `${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-muted flex items-center justify-center">
                  <CarIcon className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">{car.condition}</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {car.title || `${car.make} ${car.model}`}
                  </CardTitle>
                  <p className="text-3xl font-bold text-accent mt-2">
                    {car.price ? formatPrice(car.price) : 'Price on request'}
                  </p>
                </div>
                <Badge variant={car.is_available ? "default" : "secondary"}>
                  {car.is_available ? 'Available' : 'Sold'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Vehicle Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-medium text-foreground">{car.year}</p>
                    </div>
                  </div>
                  {car.mileage && (
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Mileage</p>
                        <p className="font-medium text-foreground">{formatMileage(car.mileage)} Km</p>
                      </div>
                    </div>
                  )}
                  {car.transmission && (
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Transmission</p>
                        <p className="font-medium text-foreground">{car.transmission}</p>
                      </div>
                    </div>
                  )}
                  {car.engine_cc && (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Engine</p>
                        <p className="font-medium text-foreground">{formatEngineCC(car.engine_cc)}</p>
                      </div>
                    </div>
                  )}
                  {car.location && (
                    <div className="flex items-center space-x-2 col-span-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">{car.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Description */}
              {car.description && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>
              )}

              <Separator />

              {/* Contact Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Interested in this vehicle?</h3>
                <Button 
                  onClick={() => setContactModalOpen(true)}
                  className="w-full premium-button hover:shadow-glow"
                  disabled={!car.is_available}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {car.is_available ? 'Contact Seller' : 'Vehicle Sold'}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Get in touch with our team for more details, scheduling a viewing, or making an inquiry.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        carTitle={car.title || `${car.make} ${car.model}`}
      />
    </div>
  );
};