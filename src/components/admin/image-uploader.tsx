
'use client';

import { useState } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ImagePlus, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  initialImageUrl?: string | null;
}

export function ImageUploader({ onUploadSuccess, initialImageUrl }: ImageUploaderProps) {
  const storage = useStorage();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }
      setFile(file);
      handleUpload(file);
    }
  };
  
  const handleUpload = (fileToUpload: File) => {
    if (!storage || !fileToUpload) return;

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `product-images/${Date.now()}-${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "There was an error uploading your image.",
        });
        setIsUploading(false);
        setUploadProgress(null);
        setFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          onUploadSuccess(downloadURL);
          setUploadProgress(100);
          setIsUploading(false);
          toast({
            title: "Upload Successful",
            description: "Your image has been uploaded.",
          });
        });
      }
    );
  };

  const handleRemoveImage = () => {
    // Note: This only removes the image from the UI state.
    // It does not delete the file from Firebase Storage.
    // Implementing deletion would require more complex state management.
    setImageUrl(null);
    setFile(null);
    setUploadProgress(null);
    onUploadSuccess(''); // Notify parent that image is removed
  };

  return (
    <div className="space-y-2">
      {imageUrl ? (
        <div className="relative group w-full h-48">
          <Image src={imageUrl} alt="Uploaded product" fill className="object-contain rounded-md border" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full">
            <label htmlFor="file-upload" className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted",
                isUploading && "cursor-default"
            )}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
                <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" disabled={isUploading} />
            </label>

            {isUploading && uploadProgress !== null && (
                <div className="flex items-center gap-2 mt-2">
                    <Progress value={uploadProgress} className="w-full" />
                    {uploadProgress === 100 ? <CheckCircle className="h-5 w-5 text-green-500" /> : <span className="text-xs">{Math.round(uploadProgress)}%</span>}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
