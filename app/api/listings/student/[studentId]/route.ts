import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import getYear from "@/lib/getYear";

interface IParams {
    studentId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    // Check if current user exist or not
    if (!currentUser) {
        return NextResponse.error();
    }

    // check if role of current user is admin
    if (currentUser?.role === "admin") {
        // Retrieve the studentId passed as parameters
        const { studentId } = params;

        // If Valid StudentId Provided or not
        if (!studentId || typeof studentId !== "string") {
            throw new Error("Invalid ID");
        }

        // Get the data of student from registeredCard whose studentId is provided
        const Student = await prisma.studentCard.findFirst({
            where: {
                id: studentId,
                verified: false,
            },
        });

        // If we don't get the Student details from database return null
        if (!Student) {
            return null;
        }

        const verifiedStudent = await prisma.studentCard.update({
            data: {
                verified: true,
            },
            where: {
                id: Student.id,
            },
        });

        //And Return the response
        return NextResponse.json(verifiedStudent);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    // Check if current user exist or not
    if (!currentUser) {
        return NextResponse.error();
    }

    // check if role of current user is admin
    if (currentUser?.role === "admin") {
        // Retrieve the studentId passed as parameters
        const { studentId } = params;

        // If Valid StudentId Provided or not
        if (!studentId || typeof studentId !== "string") {
            throw new Error("Invalid ID");
        }

        // Get the data of student from registeredCard whose studentId is provided
        const Student = await prisma.studentCard.findFirst({
            where: {
                id: studentId,
            },
        });

        // If we don't get the Student details from database return null
        if (!Student) {
            return null;
        }

        const DeleteStudent = await prisma.studentCard.delete({
            where: {
                id: Student.id,
            },
        });

        //And Return the response
        return NextResponse.json(DeleteStudent);
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: IParams }
) {
    console.log("here");
    const currentUser = await getCurrentUser();
    const { studentId } = params;
    // Check if current user exist or not
    if (!currentUser) {
        return NextResponse.error();
    }
    // If Valid StudentId Provided or not
    if (!studentId || typeof studentId !== "string") {
        throw new Error("Invalid ID");
    }
    // check if role of current user is admin
    if (currentUser?.role === "admin" || currentUser?.id === studentId) {

        // retrieve the
        const body = await request.json();
        const {
            imageSrc,
            Name,
            email,
            RollNo,
            RegistrationNo,
            Year,
            Program,
            Stream,
            SocialLinks,
            About,
            carrer_status,
            higher_study_degree,
            university,
            job_title,
            company,
            industry,
        } = body;

        var role;
        if (getYear(Year)[0] === 'Alumni') {
            role = 'alumni'
        }
        else {
            role = 'student'
        }

        await prisma.socialLinks.update({
            data: {
                linkedInLink: SocialLinks.LinkedInLink,
                githubLink: SocialLinks.GitHubLink,
                leetCodeLink: SocialLinks.LeetCodeLink,
                mediumLink: SocialLinks.MediumLink,
                phoneNum: SocialLinks.PhoneNum,
                twitterLink: SocialLinks.TwitterLink,
                resume: SocialLinks.Resume,
            },
            where: {
                id: studentId,
            }
        })

        const editStudent = await prisma.studentCard.update({
            data: {
                imageSrc,
                role,
                Name,
                email,
                RollNo: String(RollNo),
                RegistrationNo: String(RegistrationNo),
                Year: parseInt(Year, 10),
                Stream,
                Program,
                About,
                carrer_status,
                higher_study_degree,
                university,
                job_title,
                company,
                industry,
            },
            where: {
                id: studentId,
            },
        });

        //And Return the response
        return NextResponse.json(editStudent);
    }
}