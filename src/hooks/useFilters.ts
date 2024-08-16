import { useEffect, useTransition } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Selection } from '@nextui-org/react';
import { FaMale, FaFemale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { filters, setFilters } = useFilterStore();
  const { ageRange, orderBy, gender } = filters;

  // get pagination data from the pagination store
  const { pageSize, pageNumber, setPage } = usePaginationStore(state => ({
    pageNumber: state.pagination.pageNumber,
    pageSize: state.pagination.pageSize,
    setPage: state.setPage
  }));

  useEffect(() => {
    if(gender || ageRange || orderBy) {
      //console.log("useEffect-setPage");
      setPage(1)
    }
  },[gender, ageRange, orderBy, setPage]);

  useEffect(() => {
    //console.log("useEffect-update QS", {pageNumber, pageSize, orderBy, gender, ageRange});
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if(gender) params.set("gender", gender.join(','));
      if(orderBy) params.set("orderBy", orderBy);
      if(ageRange) params.set("ageRange", ageRange.join(','));
      if(pageSize) params.set("pageSize", pageSize.toString());
      if(pageNumber) params.set("pageNumber", pageNumber.toString());
  
      router.replace(`${pathname}?${params.toString()}`);
    });
  },[router, pathname, searchParams, ageRange, orderBy, gender, pageSize, pageNumber]);

  const orderByList = [
    { label: 'Last active', value: 'updatedAt' },
    { label: 'Newest members', value: 'createdAt' },
  ];

  const genderList = [
    { value: 'male', icon: FaMale },
    { value: 'female', icon: FaFemale }
  ]

  const handleAgeSelect = (value: number[]) => {
    setFilters("ageRange", value);
    //setPage(1);
  }

  const handleOrderSelect = (value: Selection) => {
    if(value instanceof Set) {
      setFilters("orderBy", value.values().next().value as string);
      //setPage(1);
    }    
  }

  const handleGenderSelect = (value: string) => {
    setFilters("gender", 
      gender.includes(value) ? gender.filter( gender => gender !== value) : [...gender,value]
    );      
    //setPage(1);
  }

  return { 
    filters, 
    genderList, 
    orderByList, 
    selectAge: handleAgeSelect, 
    selectGender: handleGenderSelect, 
    selectOrder: handleOrderSelect,
    isPending 
  };
}