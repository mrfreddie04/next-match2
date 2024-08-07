'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { toast } from 'react-toastify';
import { addImage } from '@/app/actions/userActions';
import ImageUploadButton from '@/components/ImageUploadButton';

export default function MemberPhotoUpload() {
  const router = useRouter();

  const onUploadImage = async(results: CloudinaryUploadWidgetResults) => {
    if(results.info && typeof results.info === "object") {
      await addImage(results.info.secure_url, results.info.public_id);
      router.refresh();
    } else {
      toast.error("Problem adding image");
    }
  }

  return (
    <div>
      <ImageUploadButton onUploadImage={onUploadImage}/>
    </div>    
  )
}  