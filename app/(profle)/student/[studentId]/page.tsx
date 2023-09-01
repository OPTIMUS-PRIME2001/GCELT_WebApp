
import getCurrentUser from "@/app/actions/getCurrentUser";
import getStudentById from "@/app/actions/getStudentById";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ProfileClient from "./ProfileClient";
import { SafeStudent } from "@/app/types";

interface IParams {
  studentId?: string;
}

const ProfilePage = async ({ params }: { params: IParams }) => {

  const listing = await getStudentById(params) as SafeStudent;
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ProfileClient
        Studentlist={listing}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
 
export default ProfilePage;