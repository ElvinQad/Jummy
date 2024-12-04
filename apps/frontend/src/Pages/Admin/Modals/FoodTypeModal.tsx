import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { FoodType } from '../admin.d';

interface FoodTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; slug: string; description?: string; image?: string }) => Promise<void>;
  initialData?: FoodType;
}

export function FoodTypeModal({ isOpen, onClose, onSubmit, initialData }: FoodTypeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || '',
        image: initialData.image || ''
      });
    } else {
      setFormData({ name: '', slug: '', description: '', image: '' });
    }
  }, [initialData, isOpen]);

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900/95 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            {initialData ? 'Edit Food Type' : 'Create Food Type'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name" className="text-gray-200">Name</Label>
            <Input
              required
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="slug" className="text-gray-200">Slug</Label>
            <Input
              required
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description" className="text-gray-200">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px]"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="image" className="text-gray-200">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-700 text-gray-100 hover:bg-gray-800 bg-gray-900/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-gray-100"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
