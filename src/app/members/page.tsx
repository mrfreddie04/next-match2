import PaginationComponent from "@/components/PaginationComponent";
import { getCurrentUserLikeIds } from "../actions/likeActions";
import { getMembers } from "../actions/memberActions";
import MemberCard from "./MemberCard";
import { GetMemberParams } from "@/types";
import EmptyState from "@/components/EmptyState";

type Props = {
  searchParams: GetMemberParams
}

export default async function MembersPage({searchParams}: Props) {
  // const userFilters: UserFilters = {
  //   ageRange: searchParams.ageRange?.split(",").map( (r:string) => Number(r)) || [18],
  //   gender: searchParams.gender?.split(","),
  //   orderBy: searchParams.orderBy
  // }
  const paginatedResponse = await getMembers(searchParams);
  const likeIds = await getCurrentUserLikeIds();

  const { items: members, totalCount} = paginatedResponse;

  return (
    <div className="px-2">
      {!members || members.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {members && members.map( member => (
              <MemberCard key={member.id} member={member} likeIds={likeIds}/>
            ))}
          </div>
          <PaginationComponent totalCount={totalCount}/> 
        </>
      )}
    </div>
  );
}