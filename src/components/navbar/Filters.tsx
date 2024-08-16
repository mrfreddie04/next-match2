'use client';

import React from 'react';
import { Button, Select, SelectItem, Slider, Selection, Spinner, Switch } from '@nextui-org/react';
import { useFilters } from '@/hooks/useFilters';

export default function Filters() {
  const { 
    filters, 
    genderList, 
    orderByList, 
    selectAge, 
    selectGender, 
    selectWithPhoto,
    selectOrder,
    isPending,
    totalCount
  } = useFilters();  

  const { gender, ageRange, withPhoto, orderBy } = filters;

  return (
    <div className='shadow-md py-2'>
      <div className='flex flex-row justify-around items-center'>
        <div className='flex gap-2 items-center'>
          <div className='text-secondary font-semibold tex-xl'>Results: {totalCount}</div>
          {isPending && (<Spinner size='sm' color='secondary'/>)}
        </div>
        <div className='flex gap-2 items-center'>
          <div>Gender:</div>
          {genderList.map( ({value, icon: Icon}) => (
            <Button 
              key={value} 
              size='sm' 
              isIconOnly 
              color={gender.includes(value) ? 'secondary' :'default'}
              onClick={() => selectGender(value)}
            >
              <Icon size={24}/>
            </Button>
          ))}
        </div>
        <div className='flex flex-row items-center gap-2 w-1/4'>
          <Slider 
            label='Age range'
            aria-label='Age range'
            color='secondary' 
            size='sm' 
            minValue={18} 
            maxValue={100}
            defaultValue={ageRange}
            onChangeEnd={(value) => selectAge(value as number[])}
          />
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-sm'>With photos</p>
          <Switch
            color='secondary'            
            aria-label="Show only users with photo"
            size='sm'
            isSelected={withPhoto} 
            onValueChange={selectWithPhoto}
          />
        </div>
        <div className='w-1/4'>
          <Select 
            size='sm'
            fullWidth
            label='Order by'
            variant='bordered'
            color='secondary'
            aria-label='Order by selector'
            selectedKeys={new Set([orderBy])}
            onSelectionChange={(value: Selection) => selectOrder(value)}
          >
            {orderByList.map( item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}   
          </Select>          
        </div>
      </div>
    </div>
  );
}  

  // //const [clientLoaded, setClientLoaded] = useState(false);
  // // useEffect(() => {
  // //   setClientLoaded(true);
  // // }, []);

  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const router = useRouter();

  // const orderByList = [
  //   { label: 'Last active', value: 'updatedAt' },
  //   { label: 'Newest members', value: 'createdAt' },
  // ];

  // const genders = [
  //   { value: 'male', icon: FaMale },
  //   { value: 'female', icon: FaFemale }
  // ]

  // const handleAgeSelect = (value: number[]) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("ageRange", value.join(","));
  //   router.replace(`${pathname}?${params.toString()}`); //does not change browser history
  // }

  // const handleOrderBySelect = (value: Selection) => {
  //   if(value instanceof Set) {
  //     const params = new URLSearchParams(searchParams);
  //     //const [orderBy] = Array.from(value);
  //     const orderBy = value.values().next().value as string; 
  //     params.set("orderBy", orderBy);
  //     router.replace(`${pathname}?${params.toString()}`); //does not change browser history
  //   }    
  // }

  // const selectedGender = searchParams.get("gender")?.split(',') || ['male', 'female']; 

  // const handleGenderSelect = (value: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   const gender = selectedGender.includes(value) ? selectedGender.filter( gender => gender !== value) : [...selectedGender,value]
  //   params.set("gender", gender.join(','));  
  //   router.replace(`${pathname}?${params.toString()}`); //does not change browser history 
  // }