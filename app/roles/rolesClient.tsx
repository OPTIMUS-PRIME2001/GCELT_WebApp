"use client";

import { useRouter } from "next/navigation";

import { SafeUser } from "@/app/types";

import Heading from "@/app/components/ui/Heading";
import Container from "@/app/components/Container";
import { UserList } from "@/app/components/customUi/cards/UserList";
import { columns } from "@/app/components/customUi/dataTable/columns"

interface RolesClientProps {
  allUsers: SafeUser[];
  currentUser?: SafeUser | null;
}

const RolesClient: React.FC<RolesClientProps> = ({
  allUsers,
  currentUser,
}) => {
  const router = useRouter();
    return (
    <Container>
      <Heading
        title="Waiting for Verification"
        subtitle="Where you've been and where you're going"
      />
      <div
        className="
          mt-3
          flex
          flex-col
          gap-3
        "
      >
        <UserList data={allUsers} columns={columns}/>
      </div>
    </Container>
  );
};

export default RolesClient;
