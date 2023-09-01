export const dynamic = 'force-dynamic'
// Global imports
import { redirect } from "next/navigation";

// Local imports
import prisma from "@/lib/prismadb"

// Components
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import FacultyCard from "@/app/components/customUi/cards/FacultyCard";

// actions
import getVerifiedFaculty, { VerifiedFacultyListingParam } from "@/app/actions/getVerifiedFaculty";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Filter from "@/app/components/customUi/filter/Filter";
// import getStudentById from "./actions/getStudentById";




interface HomeProps {
    searchParams: VerifiedFacultyListingParam
};

const Home = async ({ searchParams }: HomeProps) => {
    const faculty = await getVerifiedFaculty(searchParams);
    const currentUser = await getCurrentUser();
    const isEmpty = true;
    if (faculty.length === 0) {
        return (
            <ClientOnly>
                <EmptyState showReset />
            </ClientOnly>
        );
    }

    // if(!(await getStudentById(currentUser?.id)) ){
    //     redirect('/register');
    // }    

    //To check the url's currentuser if present inside database and if present then fetch it
    // const s = await prisma.teacherCard.findFirst({
    //     where: {
    //         id: currentUser?.id,
    //     }
    // })
    // if(currentUser && !s && currentUser.role !== 'admin'){
    //     redirect(`/register`);
    // } 

    const Profile = faculty.filter((my) => { return (my.id === currentUser?.id) });
    const other = faculty.filter((item) => { return (item.id !== currentUser?.id) });


    return (

        <ClientOnly>
            <Filter/>
            <Container>
                <div
                    className="
                        pt-6
                        grid 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-3 
                        lg:grid-cols-3
                        2xl:grid-cols-4
                        gap-6
                        "
                >
                    {Profile.map((facultyCard: any) => (
        				<FacultyCard
        					currentUser={currentUser}
        					key={facultyCard.id}
        					data={facultyCard}
        				/>))
        			}
        			{other.map((facultyCard: any) => (
        				<FacultyCard
        					currentUser={currentUser}
        					key={facultyCard.id}
        					data={facultyCard}
        				/>))}
        		</div>
            </Container>
        </ClientOnly>
        			
    )
}

export default Home;