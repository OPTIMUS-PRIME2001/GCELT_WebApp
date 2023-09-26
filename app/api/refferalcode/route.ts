import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { generateAccessCode } from "@/lib/generateAccessCode";

export async function PATCH(
    request: Request,
) {
    const currentUser = await getCurrentUser();

    // Check if current user exist or not
    if (!currentUser) {
        return NextResponse.error();
    }
    if (currentUser.role === 'teacher') {
        return new NextResponse("already have this role", { status: 409 });
    }
    try {
        // Retrieve the userId passed as parameters
        // from the body , we retrieve the provided name, email and hashedpassword
        const body = await request.json();
        const {  code, } = body;


        const currentDate = new Date();

        const matchedCode = await prismadb.referralCode.findFirst({
            where: {
                accessCode: code,
                codeExpiration : {
                    gte : currentDate,
                }
            },
        });
        console.log("details:", matchedCode);

        if (!matchedCode) {
            console.log('inside not matched')
            return new NextResponse("Code not matched", { status: 400 });
        }

        var upgradeduser = null;

        if (matchedCode.accessCode === code) {
            console.log('inside === if')
            if (!(matchedCode.codeExpiration > currentDate)) {
                // console.log('inside >')
                return new NextResponse("Code Expired", { status: 400 });
            }
            else {
                // console.log('insideelse')
                // let userslist = [...(matchedCode.users || [])];
                // userslist.push(currentUser.id+'-'+matchedCode.accessCode);
                // console.log(userslist);

                // const use = await prismadb.referralCode.update({
                //     data: {
                //         users: userslist,
                //     },
                //     where: {
                //         id: matchedCode.id,
                //     },
                // });
                // console.log(use);
                
                upgradeduser = await prismadb.user.update({
                    data: {
                        role: "teacher",
                    },
                    where: {
                        id: currentUser.id,
                    },
                });
            }
        }
        else{
            console.log('inside 400 else')
            return new NextResponse("Code not matched", { status: 400 });
        }
        return NextResponse.json(upgradeduser);
    }
    catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}




export async function GET(
    req: Request,
) {
    const currentUser = await getCurrentUser();

    // Check if current user exist or not
    if (!currentUser) {
        return NextResponse.error();
    }
    // check refferal code exist or not
    const result = await prismadb.referralCode.findMany();
    const code = result[0];
    let updatedCode = null;
    // //And Return the response
    // const safecode = result.map((code) => ({
    //     ...code,
    //     createdAt: code.createdAt.toISOString(),
    //     codeExpiration: code.codeExpiration.toISOString(),
    //   }));
    const currentDate = new Date();

    if (currentUser.role === 'admin' && !(code.codeExpiration > currentDate)) {
        code.accessCode = generateAccessCode();
        const ExpiryDate = new Date(currentDate).setDate(currentDate.getDate() + 2);
        code.codeExpiration = new Date(ExpiryDate);

        updatedCode = await prismadb.referralCode.update({
            data: {
                accessCode: code.accessCode,
                createdBy: currentUser.id,
                codeExpiration: code.codeExpiration,
            },
            where: {
                id: code.id,
            },
        });

    }
    else {
        updatedCode = code;
    }



    return NextResponse.json(updatedCode);
}