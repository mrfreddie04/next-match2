'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { RegisterSchema} from "@/lib/schemas/registerSchema";
import { Gender } from "@/types";
import { format, subYears } from 'date-fns';

const genderList: { label: string, value: Gender}[] = [
  { label: 'Male', value: 'male'},
  { label: 'Female', value: 'female'}
]

export default function ProfileForm() {
  //const { register, getValues, setValue, formState: {errors} } = useFormContext();
  const { register, getValues, setValue, formState: {errors} } = useFormContext<RegisterSchema>();

  //const maxDate = format(subYears(new Date(), 18), 'yyyy-MM-dd');

  return(
    <div className="space-y-4">
      <Select 
        fullWidth
        label='Gender'
        variant='bordered'        
        {...register('gender')}
        isInvalid={!!errors.gender}
        errorMessage={errors.gender?.message as string}        
        aria-label='Select gender'
        defaultSelectedKeys={new Set([getValues('gender')])}        
      >
        {genderList.map( item => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}   
      </Select>     
      <Input
        defaultValue={getValues('dateOfBirth')}
        label='Date of birth'
        variant='bordered'
        max={format(subYears(new Date(), 18), 'yyyy-MM-dd')}
        type='date'
        isInvalid={!!errors.dateOfBirth}
        errorMessage={errors.dateOfBirth?.message}
        {...register('dateOfBirth')}
      />              
      <Textarea
        defaultValue={getValues('description')}
        label='Description'
        variant='bordered'
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        {...register('description')}
      />          
      <Input
        defaultValue={getValues('city')}
        label='City'
        variant='bordered'
        isInvalid={!!errors.city}
        errorMessage={errors.city?.message}
        {...register('city')}
      />
      <Input
        defaultValue={getValues('country')}
        label='Country'
        variant='bordered'
        isInvalid={!!errors.country}
        errorMessage={errors.country?.message}
        {...register('country')}
      />      
    </div>
  )
}

//        onChange={(e) => {setValue('gender', e.target.value as Gender)}}
//onChange={(e) => {setValue('gender', e.target.value as Gender)}}