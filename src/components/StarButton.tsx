import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { PiSpinnerGap } from 'react-icons/pi';

type Props = {
  selected: boolean;
  loading: boolean;
}

export default function StarButton({selected, loading}: Props) {

  return (
    <div className='relative hover:opacity-80 transition cursor-pointer'>
      {!loading ? (
        <>
          <AiOutlineStar size={32} className='absolute -top-[2px] -left-[2px] fill-white'/>    
          <AiFillStar size={28} className={selected? 'fill-yellow-200':'fill-neutral-500/70'}/>    
        </>
        ) : (
          <PiSpinnerGap size={32} className='fill-white animate-spin'/>
        )
      }  
    </div>
  )
}