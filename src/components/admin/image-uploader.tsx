
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useStorage } from '@/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface ImagePickerProps {
  onImageSelect: (url: string) => void;
  initialImageUrl?: string | null;
}

export function ImageUploader({ onImageSelect, initialImageUrl }: ImagePickerProps) {
  const storage = useStorage();
  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (storage) {
      const imagesRef = ref(storage, 'product-images/');
      listAll(imagesRef)
        .then(async (res) => {
          const urlPromises = res.items.map((itemRef) => getDownloadURL(itemRef));
          const urls = await Promise.all(urlPromises);
          setImageList(urls);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching images from storage:", error);
          toast({
            variant: "destructive",
            title: "Could not load images",
            description: "Failed to fetch images from Firebase Storage. Make sure you have uploaded files to the 'product-images' folder.",
          });
          setIsLoading(false);
        });
    } else {
        setIsLoading(false);
    }
  }, [storage, toast]);

  const handleSelectImage = (url: string) => {
    setSelectedImageUrl(url);
    onImageSelect(url);
  };

  const handleRemoveImage = () => {
    setSelectedImageUrl(null);
    onImageSelect(''); // Notify parent that image is removed
  };

  return (
    <div className="space-y-2">
      <div className="relative group w-full h-48">
        {selectedImageUrl ? (
          <>
            <Image src={selectedImageUrl} alt="Selected product" fill className="object-contain rounded-md border" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
            <div className="flex items-center justify-center w-full h-full border-2 border-dashed rounded-lg bg-muted/50">
                <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-8 w-8" />
                    <p>No image selected</p>
                </div>
            </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading images from storage...
            </p>
        </div>
      ) : (
        <Select onValueChange={handleSelectImage} value={selectedImageUrl || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select an image" />
          </SelectTrigger>
          <SelectContent>
            {imageList.length > 0 ? (
                imageList.map((url, index) => (
                    <SelectItem key={index} value={url}>
                        {/* Extracting file name from URL for display */}
                        {decodeURIComponent(url.split('/').pop()!.split('?')[0].replace('product-images%2F',''))}
                    </SelectItem>
                ))
            ) : (
                <div className="p-4 text-sm text-center text-muted-foreground">
                    No images found in the 'product-images' folder in Firebase Storage.
                </div>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
