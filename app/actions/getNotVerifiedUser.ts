import prisma from "@/lib/prismadb";

export interface NotVerifiedListingParams {
    id: string;
    Name?: string;
    email?: string;
    Year?: number;
    RollNo?: string;
    RegistrationNo?: string;
    Semester?: string;
    Stream?: string;

    Department?: string;
    Designation?: string;
    Qualification?: string;
    Specialization?: string;
    linkedInurl?: string;
    resumeurl?: string;
    verified: Boolean;
}

export default async function getNotVerifiedUser(
    params: NotVerifiedListingParams
) {
    try {
        const {
            id,
            Name,
            email,
            Year,
            RollNo,
            RegistrationNo,
            Semester,
            Stream,

            Department,
            Designation,
            Qualification,
            Specialization,
            linkedInurl,
            resumeurl,
            verified,
        } = params;

        let query: any = {};
        // to check whether
        if (id) {
            query.id = id;
        }
        if (Name) {
            query.Name = Name;
        }
        if (email) {
            query.email = email;
        }
        if (RollNo) {
            query.RollNo = RollNo;
        }
        if (RegistrationNo) {
            query.RegistrationNo = RegistrationNo;
        }
        if (Semester) {
            query.Semester = Semester;
        }
        if (Stream) {
            query.Name = Name;
        }
        if (Year) {
            query.Year = Number(Year);
        }
        // if(verified){
        //   query.verified === false ;
        // }


        const NotVerifiedStudent = await prisma.studentCard.findMany({
            where: { AND: [query, { verified: false }] },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const NotVerifiedStudentwithSocial = await Promise.all(
            NotVerifiedStudent.map(async (studentCard) => {
              const mySocialLinks = await prisma.socialLinks.findUnique({
                where: {
                  id: studentCard.id,
                },
              });         
      
          
              return {
                ...studentCard,
                ...mySocialLinks,
              };
            })
          );


        const NotVerifiedfaculty = await prisma.teacherCard.findMany({
            where: { AND: [query, { verified: false }] },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const mergedList = [...NotVerifiedStudentwithSocial, ...NotVerifiedfaculty].sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        const safeListings = mergedList.map((notVerifiedCard) => ({
            ...notVerifiedCard,
            createdAt: notVerifiedCard.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}