'use client';

import React, { useState } from 'react';
import { Photo } from '@prisma/client';
import StarButton from '@/components/StarButton';
import DeleteButton from '@/components/DeleteButton';
import MemberImage from '@/components/MemberImage';
import { useRouter } from 'next/navigation';
import { deleteImage, setMainImage } from '@/app/actions/userActions';
import { toast } from 'react-toastify';

type Props = {    
  photos: Photo[] | null,
  editing?: boolean,
  mainImageUrl?: string | null
}

export default function MemberPhotos({photos, editing, mainImageUrl}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState({
    type: '',
    isLoading: false,
    id: ''
  });
  //console.log("PROPS1",mainImageUrl, loading);

  const onSetMain = async (photo: Photo) => {
    if(photo.url === mainImageUrl) return;
    setLoading({type: 'main', isLoading: true, id: photo.id});
    try {
      await setMainImage(photo);
      //console.log("Refresh");
      //await refreshToken();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading({ isLoading: false, id: '', type: '' })
    }    
    // setMainImage(photo)
    //   .then( () => router.refresh()) //rerenders with the mainImageUrl updated, to update selected prop
    //   .catch( (e) => toast.error(e.message))
    //   .finally( ()=>setLoading({type: '', isLoading: false, id: ''})); //reset local state
  }

  const onDelete = async (photo: Photo) => {
    if(photo.url === mainImageUrl) return;
    setLoading({type: 'delete', isLoading: true, id: photo.id});
    try {
      await deleteImage(photo);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading({ isLoading: false, id: '', type: '' })
    }       
  }  

  return (
    <div className='grid grid-cols-5 gap-3 p-5'>
      {photos && photos.map( photo => (
        <div key={photo.id} className='relative'>
          <MemberImage photo={photo}/>
          { editing && (
            <>
              <div onClick={() => onSetMain(photo)} className='absolute top-3 left-3 z-50'>
                <StarButton 
                  loading={loading.isLoading && loading.type === 'main' && loading.id === photo.id} 
                  selected={mainImageUrl === photo.url}
                />
              </div>
              <div onClick={() => onDelete(photo)} className='absolute top-3 right-3 z-50'>
                <DeleteButton 
                  loading={loading.isLoading && loading.type === 'delete' && loading.id === photo.id} 
                />
              </div>              
            </>
          )}
        </div>
      ))}
    </div>    
  )
} 