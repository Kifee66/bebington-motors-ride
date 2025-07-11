import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Car, Plus, Trash2, Upload, Eye, Edit3, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CarFormData {
  title: string;
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  condition: string;
  location: string;
  description: string;
  image_url: string;
}

interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  location: string;
  description: string;
  image_url: string;
  is_available: boolean;
  owner_id: string;
}

export const AddCar: React.FC = () => {
  const { user, isAdmin, redirectIfNotAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CarFormData>({
    title: '',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    condition: '',
    location: '',
    description: '',
    image_url: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can add vehicles.",
        variant: "destructive",
      });
      redirectIfNotAdmin();
      return;
    }
    fetchUserCars();
  }, [user, isAdmin, navigate, redirectIfNotAdmin]);

  const fetchUserCars = async () => {
    if (!user || !isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserCars(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof CarFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    const newImages = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select only image files.",
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select images smaller than 5MB.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setUploadedImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToSupabase = async (): Promise<string[]> => {
    if (!uploadedImages.length) return [];
    
    setUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of uploadedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload some images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
    
    return uploadedUrls;
  };

  const validateForm = (): boolean => {
    const requiredFields = ['title', 'make', 'model', 'year', 'condition'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    const year = parseInt(formData.year);
    if (year < 1900 || year > new Date().getFullYear() + 1) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid year",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !isAdmin) {
      toast({
        title: "Error",
        description: "Only administrators can add vehicles",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Upload images first
      const imageUrls = await uploadImagesToSupabase();
      const primaryImageUrl = imageUrls.length > 0 ? imageUrls[0] : formData.image_url;
      const carData: TablesInsert<'cars'> = {
        id: 0, // This will be auto-generated by the database
        title: formData.title,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: formData.price ? parseFloat(formData.price) : null,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        condition: formData.condition,
        location: formData.location || null,
        description: formData.description || null,
        image_url: primaryImageUrl || null,
        owner_id: user.id,
        is_available: true,
      };

      let result;
      if (editingCar) {
        // For updates, don't include the id in the data
        const { id, ...updateData } = carData;
        result = await supabase
          .from('cars')
          .update(updateData)
          .eq('id', editingCar.id);
      } else {
        result = await supabase
          .from('cars')
          .insert(carData);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success!",
        description: editingCar ? "Car updated successfully" : "Car added successfully",
      });

      // Reset form
      setFormData({
        title: '',
        make: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        condition: '',
        location: '',
        description: '',
        image_url: '',
      });
      setEditingCar(null);
      setUploadedImages([]);
      
      // Refresh the car list
      await fetchUserCars();

    } catch (error) {
      console.error('Error saving car:', error);
      toast({
        title: "Error",
        description: "Failed to save car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      title: car.title || '',
      make: car.make || '',
      model: car.model || '',
      year: car.year?.toString() || '',
      price: car.price?.toString() || '',
      mileage: car.mileage?.toString() || '',
      condition: car.condition || '',
      location: car.location || '',
      description: car.description || '',
      image_url: car.image_url || '',
    });
  };

  const handleDelete = async (carId: number) => {
    if (!user || !isAdmin) return;
    
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Car deleted successfully",
      });

      await fetchUserCars();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditingCar(null);
    setUploadedImages([]);
    setFormData({
      title: '',
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      condition: '',
      location: '',
      description: '',
      image_url: '',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            {editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {editingCar ? 'Update your vehicle information' : 'Share your premium automobile with our community'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="car-card border-border bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Car className="h-5 w-5 text-primary" />
                  <span>{editingCar ? 'Edit Vehicle Details' : 'Vehicle Information'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-foreground font-medium">
                        Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., 2023 BMW M3 Competition"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="luxury-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition" className="text-foreground font-medium">
                        Condition *
                      </Label>
                      <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                        <SelectTrigger className="luxury-input">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make" className="text-foreground font-medium">
                        Make *
                      </Label>
                      <Input
                        id="make"
                        placeholder="e.g., BMW"
                        value={formData.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        className="luxury-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-foreground font-medium">
                        Model *
                      </Label>
                      <Input
                        id="model"
                        placeholder="e.g., M3"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="luxury-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-foreground font-medium">
                        Year *
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2023"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="luxury-input"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="price" className="text-foreground font-medium">
                         Price (KSH)
                       </Label>
                       <Input
                         id="price"
                         type="number"
                         placeholder="750000"
                         value={formData.price}
                         onChange={(e) => handleInputChange('price', e.target.value)}
                         className="luxury-input"
                         min="0"
                         step="1"
                       />
                     </div>

                    <div className="space-y-2">
                      <Label htmlFor="mileage" className="text-foreground font-medium">
                        Mileage
                      </Label>
                      <Input
                        id="mileage"
                        type="number"
                        placeholder="25000"
                        value={formData.mileage}
                        onChange={(e) => handleInputChange('mileage', e.target.value)}
                        className="luxury-input"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-foreground font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., New York, NY"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="luxury-input"
                    />
                  </div>

                   <div className="space-y-2">
                     <Label className="text-foreground font-medium">
                       Images
                     </Label>
                     
                     {/* File Upload */}
                     <div className="space-y-4">
                       <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                         <input
                           type="file"
                           id="images"
                           multiple
                           accept="image/*"
                           onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                           className="hidden"
                         />
                         <label htmlFor="images" className="cursor-pointer">
                           <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                           <p className="text-sm text-muted-foreground">
                             Click to upload images or drag and drop
                           </p>
                           <p className="text-xs text-muted-foreground mt-1">
                             PNG, JPG, JPEG up to 5MB each (max 5 images)
                           </p>
                         </label>
                       </div>

                       {/* Image Preview */}
                       {uploadedImages.length > 0 && (
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {uploadedImages.map((file, index) => (
                             <div key={index} className="relative group">
                               <img
                                 src={URL.createObjectURL(file)}
                                 alt={`Preview ${index + 1}`}
                                 className="w-full h-24 object-cover rounded-lg border border-border"
                               />
                               <button
                                 type="button"
                                 onClick={() => removeUploadedImage(index)}
                                 className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 <X className="h-3 w-3" />
                               </button>
                             </div>
                           ))}
                         </div>
                       )}

                       {/* Or URL Input */}
                       <div className="relative">
                         <div className="absolute inset-0 flex items-center">
                           <div className="w-full border-t border-border" />
                         </div>
                         <div className="relative flex justify-center text-xs uppercase">
                           <span className="bg-background px-2 text-muted-foreground">Or use URL</span>
                         </div>
                       </div>
                       
                       <Input
                         id="image_url"
                         type="url"
                         placeholder="https://example.com/car-image.jpg"
                         value={formData.image_url}
                         onChange={(e) => handleInputChange('image_url', e.target.value)}
                         className="luxury-input"
                       />
                     </div>
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your vehicle's features, history, and unique qualities..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="luxury-input min-h-[120px]"
                      rows={5}
                    />
                  </div>

                   <div className="flex space-x-4">
                     <Button
                       type="submit"
                       disabled={loading || uploading}
                       className="premium-button hover:shadow-glow flex-1"
                     >
                       {loading || uploading ? (
                         <div className="flex items-center space-x-2">
                           <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                           <span>{uploading ? 'Uploading...' : editingCar ? 'Updating...' : 'Adding...'}</span>
                         </div>
                       ) : (
                         <div className="flex items-center space-x-2">
                           {editingCar ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                           <span>{editingCar ? 'Update Vehicle' : 'Add Vehicle'}</span>
                         </div>
                       )}
                     </Button>

                    {editingCar && (
                      <Button
                        type="button"
                        onClick={cancelEdit}
                        variant="outline"
                        className="border-border hover:bg-muted"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Your Cars List */}
          <div className="lg:col-span-1">
            <Card className="car-card border-border bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Car className="h-5 w-5 text-primary" />
                  <span>Your Vehicles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userCars.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No vehicles added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCars.map((car) => (
                      <div
                        key={car.id}
                        className="p-4 border border-border rounded-lg space-y-3 hover-lift transition-smooth"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {car.title || `${car.make} ${car.model}`}
                            </h4>
                            <p className="text-sm text-muted-foreground">{car.year}</p>
                          </div>
                          <Badge className="bg-primary/20 text-primary">{car.condition}</Badge>
                        </div>
                        
                        {car.image_url && (
                          <img
                            src={car.image_url}
                            alt={car.title}
                            className="w-full h-24 object-cover rounded"
                          />
                        )}
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEdit(car)}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-border hover:bg-muted"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(car.id)}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};