import prisma from "@/lib/prismadb";

export interface VerifiedListingParams {
  id: string;
  role?: string;
  Name?: string;
  email?: string;
  RollNo?: string;
  RegistrationNo?: string;
  Year?: number;
  Program?: string;
  Stream?: string;
  verified: Boolean;
}

export default async function getVerifiedStudents(
  params: VerifiedListingParams
) {
  try {
    const {
      id,
      Name,
      role,
      email,
      RollNo,
      RegistrationNo,
      Year,
      Program,
      Stream,
      verified,
    } = params;

    let query: any = {};
    // to check whether
    if (id) {
      query.id = id;
    }
    if (role) {
      query.role = role;
    }
    if (Name) {
      query.Name = { contains: Name, mode: 'insensitive' };
    }
    if (email) {
      query.email = { contains: email, mode: 'insensitive' };;
    }
    if (RollNo) {
      query.RollNo = { contains: RollNo, mode: 'insensitive' };
    }
    if (RegistrationNo) {
      query.RegistrationNo = { contains: RegistrationNo, mode: 'insensitive' };
    }
    if (Program) {
      query.Program = Program;
    }
    if (Stream) {
      query.Stream = Stream;
    }
    if (Year) {
      query.Year = Number(Year);
    }
    // if(verified){
    //   query.verified = false;
    // }


    const studentlist = await prisma.studentCard.findMany({
      where: { AND: [query, { verified: true }] },
      orderBy: {
        Name: 'asc'
      }
    });

    // const safeListings = studentlist.map((studentCard) => ({
    //   const mySocialLinks = await prisma.socialLinks.findUnique({
    //     where: {
    //       studentId: studentCard.id,
    //     },
    //   }),
    //   ...studentCard,
    //   ...mySocialLinks,
    //   createdAt: studentCard.createdAt.toISOString(),
    // }));

    const safeListings = await Promise.all(
      studentlist.map(async (studentCard) => {
        const mySocialLinks = await prisma.socialLinks.findUnique({
          where: {
            id: studentCard.id,
          },
        });
    

    
        return {
          ...studentCard,
          ...mySocialLinks,
          createdAt: studentCard.createdAt.toISOString(),
        };
      })
    );

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
