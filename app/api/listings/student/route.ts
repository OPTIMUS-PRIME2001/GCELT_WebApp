import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getYear from "@/lib/getYear";

// we no longer have to use request methods in a switch method
// we can create out custom POST request method
export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    // if current user exits or not
    if (!currentUser) {
        return NextResponse.error();
    }

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

    console.log("link:", SocialLinks?.GitHubLink
    );

    var role;
    if (getYear(Year)[0] === 'Alumni') {
        role = 'alumni'
    }
    else {
        role = 'student'
    }


    // Object.keys(body).forEach((value: any) => {
    //     if (!body[value]) {
    //         NextResponse.error();
    //     }
    // });

    // Now insert into database table RegisteredCard as a new student and pass the retrieved details
    await prisma.socialLinks.create({
        data: {
            id: currentUser.id,
            linkedInLink:SocialLinks.LinkedInLink,
            githubLink: SocialLinks.GitHubLink,
            leetCodeLink:SocialLinks.LeetCodeLink,
            mediumLink: SocialLinks.MediumLink,
            phoneNum: SocialLinks.PhoneNum,
            twitterLink: SocialLinks.TwitterLink,
            resume: SocialLinks.Resume,
        }
    })

    const verificationListing = await prisma.studentCard.create({
        data: {
            imageSrc,
            role,
            Name,
            email,
            RollNo: String(RollNo),
            RegistrationNo: String(RegistrationNo),
            Year: parseInt(Year, 10),
            Stream: Stream,
            id: currentUser.id,
            Program,
            About,
            carrer_status,
            higher_study_degree,
            university,
            job_title,
            company,
            industry,
        },
    });

    return NextResponse.json(verificationListing);
}