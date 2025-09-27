
'use client';

import * as React from 'react';
import { useState, useId } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ImagePlus, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  initialImageUrl?: string | null;
}

export function ImageUploader({ onUploadSuccess, initialImageUrl }: ImageUploaderProps) {
  const storage = useStorage();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();
  const fileInputId = useId();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit before compression
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
        });
        return;
      }
      
      setIsCompressing(true);
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        await handleUpload(compressedFile);
      } catch (error) {
        console.error('Image compression failed:', error);
        toast({
            variant: "destructive",
            title: "Compression Failed",
            description: "Could not compress the image. Please try a different file.",
        });
         // Fallback to uploading original file if compression fails
        await handleUpload(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };
  
  const handleUpload = async (fileToUpload: File) => {
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
    setImageUrl(null);
    setUploadProgress(null);
    onUploadSuccess(''); // Notify parent that image is removed
  };

  const isProcessing = isCompressing || isUploading;

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
            <label htmlFor={fileInputId} className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted",
                isProcessing && "cursor-default opacity-70"
            )}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-8 h-8 mb-4 text-muted-foreground animate-spin" />
                            <p className="text-sm text-muted-foreground">{isCompressing ? 'Compressing...' : 'Uploading...'}</p>
                        </>
                    ) : (
                        <>
                            <ImagePlus className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 10MB)</p>
                        </>
                    )}
                </div>
                <Input id={fileInputId} type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" disabled={isProcessing} />
            </label>

            {isUploading && uploadProgress !== null && !isCompressing && (
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
