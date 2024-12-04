import { useState, FC, FormEvent, ChangeEvent, useEffect } from 'react';
import { Camera, Coffee, Users, Loader2 } from 'lucide-react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { useInView } from 'react-intersection-observer';
import { useToast } from "../ui/use-toast";
import useAuthStore from '../auth/authStore';
import { Textarea } from "../ui/textarea"; // You'll need to create/import this
import { Label } from "../ui/label"; // Add this import
import { api } from "../../lib/axios";
import { Checkbox } from "../ui/checkbox"; // Add this import

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg'
];

interface Category {
  id: number;
  name: string;
  subcategories?: { id: number; name: string; }[];
}

interface FormData {
  businessName: string;
  description: string;
  mainCategoryIds: number[];
  subCategoryIds: number[];
  certificates: File[];
  documents: File[];
}

interface FormErrors {
  businessName?: string;
  description?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
  certificates?: string;
  documents?: string;
}

interface Stat {
  icon: JSX.Element;
  count: string;
  label: string;
}

const BecomeChef: FC = () => {
  const { toast } = useToast();
  const { isAuthenticated, setShowAuthModal, setAuthMode } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    description: '',
    mainCategoryIds: [],
    subCategoryIds: [],
    certificates: [],
    documents: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await api.get('/chefs/categories/hierarchy');
        setCategories(response.data as Category[]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Business name validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (formData.businessName.length < 3) {
      newErrors.businessName = 'Business name must be at least 3 characters';
    } else if (formData.businessName.length > 100) {
      newErrors.businessName = 'Business name must be less than 100 characters';
    }
  
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
  
    // Category validations
    if (!Array.isArray(formData.mainCategoryIds) || formData.mainCategoryIds.length === 0) {
      newErrors.mainCategoryId = 'Please select at least one main category';
    }
    
    if (!Array.isArray(formData.subCategoryIds) || formData.subCategoryIds.length === 0) {
      newErrors.subCategoryId = 'Please select at least one subcategory';
    }

    return newErrors;
  };

  const validateFiles = (files: File[]): string | null => {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return `File ${file.name} is too large. Maximum size is 5MB`;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `File ${file.name} has invalid type. Allowed types are PDF, JPG, and PNG`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    // Validate files
    const certificatesError = validateFiles(formData.certificates);
    const documentsError = validateFiles(formData.documents);
    
    if (certificatesError) {
      setErrors(prev => ({ ...prev, certificates: certificatesError }));
      return;
    }
    if (documentsError) {
      setErrors(prev => ({ ...prev, documents: documentsError }));
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('mainCategoryIds', JSON.stringify(formData.mainCategoryIds));
      formDataToSend.append('subCategoryIds', JSON.stringify(formData.subCategoryIds));

      // Append certificates with the correct field name
      formData.certificates.forEach((file) => {
        formDataToSend.append('certificateFiles', file);
      });

      // Append documents with the correct field name
      formData.documents.forEach((file) => {
        formDataToSend.append('documentFiles', file);
      });


      const response = await api.post('/chef-applications', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Success!",
        description: "Your application has been submitted successfully.",
        variant: "success",
      });

      // Reset form
      setFormData({
        businessName: '',
        description: '',
        mainCategoryIds: [],
        subCategoryIds: [],
        certificates: [],
        documents: []
      });
      setErrors({});

    } catch (error: any) {
      let errorMessage = "Failed to submit application.";
      
      if (error.response?.data?.statusCode === 400 && error.response.data.message === "Application already exists for this user") {
        toast({
          title: "Application Exists",
          description: "You have already submitted an application.",
          variant: "destructive",
        });
        return;
      }
      
      // Existing error handling...
      if (error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message) 
          ? error.response.data.message 
          : [error.response.data.message];
          
        const newErrors: FormErrors = {};
        messages.forEach((msg: string) => {
          if (msg.includes('businessName')) {
            newErrors.businessName = msg;
          } else if (msg.includes('description')) {
            newErrors.description = msg;
          } else if (msg.includes('mainCategoryIds')) {
            newErrors.mainCategoryId = msg;
          } else if (msg.includes('subCategoryIds')) {
            newErrors.subCategoryId = msg;
          }
        });
        
        setErrors(newErrors);
        errorMessage = "Please correct the errors in the form.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'certificates' | 'documents') => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileError = validateFiles(files);
      
      if (fileError) {
        setErrors(prev => ({ ...prev, [field]: fileError }));
        e.target.value = ''; // Reset input
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: files
      }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAuthClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };


  const CategorySelection = () => {
    if (isCategoriesLoading) {
      return (
        <div className="space-y-4">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          <p className="text-center text-sm text-gray-500">Loading categories...</p>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <p className="text-center text-sm text-gray-500">
          No categories available. Please try again later.
        </p>
      );
    }

    const handleMainCategoryChange = (categoryId: number) => {
      setFormData(prev => ({
        ...prev,
        mainCategoryIds: prev.mainCategoryIds.includes(categoryId)
          ? prev.mainCategoryIds.filter(id => id !== categoryId)
          : [...prev.mainCategoryIds, categoryId]
      }));
    };

    const handleSubCategoryChange = (subCategoryId: number) => {
      setFormData(prev => ({
        ...prev,
        subCategoryIds: prev.subCategoryIds.includes(subCategoryId)
          ? prev.subCategoryIds.filter(id => id !== subCategoryId)
          : [...prev.subCategoryIds, subCategoryId]
      }));
    };

    return (
      <div className="space-y-4">
        <div>
          <Label>Select Main Categories</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={formData.mainCategoryIds.includes(category.id)}
                  onCheckedChange={() => handleMainCategoryChange(category.id)}
                />
                <Label htmlFor={`cat-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </div>
          {errors.mainCategoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.mainCategoryId}</p>
          )}
        </div>

        {formData.mainCategoryIds.length > 0 && (
          <div>
            <Label>Select Subcategories</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {categories
                .filter(cat => formData.mainCategoryIds.includes(cat.id))
                .map(category => 
                  category.subcategories?.map(sub => (
                    <div key={sub.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sub-${sub.id}`}
                        checked={formData.subCategoryIds.includes(sub.id)}
                        onCheckedChange={() => handleSubCategoryChange(sub.id)}
                      />
                      <Label htmlFor={`sub-${sub.id}`}>{sub.name}</Label>
                    </div>
                  ))
                )}
            </div>
            {errors.subCategoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.subCategoryId}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const stats: Stat[] = [
    { icon: <Coffee className="w-12 h-12 text-pink-500" />, count: '24,896+', label: 'Food' },
    { icon: <Users className="w-12 h-12 text-pink-500" />, count: '2.5K', label: 'Clients' },
    { icon: <Camera className="w-12 h-12 text-pink-500" />, count: '250+', label: 'Chef' }
  ];

  return (
    <div className="relative w-full bg-gradient-to-b from-pink-500/90 via-pink-600/80 to-background dark:from-pink-900/80 dark:via-dark-primary dark:to-dark-background py-16 mb-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-start gap-8">
          <Card className="w-full lg:w-1/3 shadow-xl dark:bg-dark-card dark:border-dark-border">
            <CardHeader>
              <h5 className="text-pink-500 dark:text-pink-400 font-semibold text-xl">
                {isAuthenticated ? 'Apply to Become a Chef' : 'Join Our Chef Network'}
              </h5>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      name="businessName"
                      placeholder="Business Name*"
                      value={formData.businessName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={errors.businessName ? 'border-red-500' : ''}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      name="description"
                      placeholder="Description of your business and cooking experience*"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <CategorySelection />

                  <div className="space-y-2">
                    <div>
                      <Input
                        type="file"
                        multiple
                        name="certificates"
                        onChange={(e) => handleFileChange(e, 'certificates')}
                        disabled={isLoading}
                        className={errors.certificates ? 'border-red-500' : ''}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="text-sm text-gray-500 mt-1">Upload your certificates (optional)</p>
                      {errors.certificates && (
                        <p className="text-red-500 text-sm mt-1">{errors.certificates}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="file"
                        multiple
                        name="documents"
                        onChange={(e) => handleFileChange(e, 'documents')}
                        disabled={isLoading}
                        className={errors.documents ? 'border-red-500' : ''}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="text-sm text-gray-500 mt-1">Upload additional documents (optional)</p>
                      {errors.documents && (
                        <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Ready to share your culinary expertise? Join our platform as a chef!
                  </p>
                  <Button 
                    onClick={handleAuthClick}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                  >
                    Sign In to Apply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="w-full lg:w-1/3" ref={ref}>
            <div className="text-white mb-8">
              <h3 className="text-3xl font-bold mb-4 text-white dark:text-white">Become A HomeChef.</h3>
              <p className="text-white/90 dark:text-white/80">
                Now you can make food happen pretty much wherever you are thanks to the free easy-to-use
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className={`transform transition duration-500 dark:bg-dark-card dark:border-dark-border ${
                    inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-3">
                      {stat.icon}
                    </div>
                    <div>
                      <h5 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.count}</h5>
                      <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-0 right-0 w-1/4 h-full">
            <picture>
              <source srcSet="assets/images/chef/chef.png" type="image/webp" />
              <img
                src="assets/images/chef/chef.png"
                alt="Professional Chef"
                className="absolute bottom-0 w-full object-contain"
                style={{ maxHeight: '90%' }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/images/chef/chef-fallback.png';
                  console.log('Failed to load chef image');
                }}
              />
            </picture>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BecomeChef;