import React from 'react';
import ListsTab from './ListsTab';
import { getCurrentUserLikeIds, getCurrentUserLikedMembers } from '../actions/likeActions';
import { LikeType } from '@/types';

type Props = {
  searchParams: {
    type: string
  }
}

export default async function ListsPage({searchParams}: Props) {
  //console.log("Lists Page",searchParams.type);

  const likeIds = await getCurrentUserLikeIds();
  const members = await getCurrentUserLikedMembers(searchParams.type);

  return (
    <div>
      <ListsTab members={members} likeIds={likeIds}/>
    </div>
  )
}
