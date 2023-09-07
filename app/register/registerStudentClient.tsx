'use client';

//icons
import { MdAlternateEmail, MdLockOutline, MdOutlineCalendarMonth } from "react-icons/md"
import { HiOutlineUser, HiOutlineDocumentSearch } from "react-icons/hi"
import { Tb123 } from "react-icons/tb"
import { BsLinkedin, BsGithub, BsMedium, BsTrophy } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { SiLeetcode, SiTwitter } from "react-icons/si";
import { PiGraduationCapDuotone } from "react-icons/pi";

// Global import 
import axios from "axios";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

// types safety
import { SafeUser } from "@/app/types";
import getYear from "@/lib/getYear";

//components
import { Input } from "@/app/components/ui/input";
import { Button } from '@/app/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select"
import Heading from "@/app/components/ui/Heading";
import ImageUpload from "@/app/components/modals/ImageUpload";




const currentYear = Number(new Date().getFullYear());
const courseOptions = ['BTech', 'MTech'] as const;
const streamOptions = {
    BTech: ['Computer Science Engineering', 'Information Technology', 'Leather Technology'],
    MTech: ['Leather Technology'],
} as const;
const carrerOptions = ['Higher Studies', 'Job', 'Other Profession'] as const;

const studentRegistration = z.object({
    imageSrc: z.string().url().optional(),
    Name: z.string().min(3), //.optional().transform(e => e === "" ? undefined : e) , // atleast 3 character is required to properly name our store
    email: z.string().email(),
    RollNo: z.coerce.number({
        required_error: "Roll No must be of 11 digit",
    }).optional(),
    RegistrationNo: z.coerce.number({
        required_error: "Registration No must be of 16 digit",
    }).optional(),
    Year: z.coerce.number().min(4).lte(currentYear),
    Program: z.enum(courseOptions),
    Stream: z.enum([...streamOptions.BTech, ...streamOptions.MTech]),
    SocialLinks: z.object({
        LinkedInLink: z.string().url().optional(),
        GitHubLink: z.string().url().optional(),
        MediumLink: z.string().url().optional(),
        LeetCodeLink: z.string().url().optional(),
        PhoneNum: z.string().url().optional(),
        TwitterLink: z.string().url().optional(),
        Resume: z.string().url().optional(),
    }),
    About: z.string().optional(),
    carrer_status: z.enum(carrerOptions).optional(),
    higher_study_degree: z.string().optional(),
    university: z.string().optional(),
    job_title: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
});

interface ProfileClientProps {
    currentUser?: SafeUser | null;
}

const RegisterStudentClient: React.FC<ProfileClientProps> = ({
    currentUser
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof studentRegistration>>({
        resolver: zodResolver(studentRegistration),
        defaultValues: {
            imageSrc: "",
            Name: "",
            email: String(currentUser?.email),
            RollNo: 0,
            RegistrationNo: 0,
            Year: currentYear,
            Program: "BTech",
            // SocialLinks: {
            //     LinkedInLink: "",
            //     GitHubLink: "",
            //     MediumLink: "",
            //     LeetCodeLink: "",
            //     PhoneNum: "",
            // },
            About: "",
        },
    })

    // const setCustomValue = (id: string, value: any) => {
    //     form.setValue(id, value, {
    //         shouldDirty: true,
    //         shouldTouch: true,
    //         shouldValidate: true
    //     })
    // }
    const imageSrc = form.watch('imageSrc');

    const onSubmit = async (data: z.infer<typeof studentRegistration>) => {
        setIsLoading(true);
        console.log(data);
        
        await axios.post('/api/listings/student', data)
            .then(() => {
                toast.success('Updated Successful!');
                router.refresh();
                form.reset();
            })
            .catch(() => {
                toast.error('Something went wrong.');
            })
            .finally(() => {
                setIsLoading(false);
            })
        // setIsLoading(false);
    }

    return (
        <>
            <Form {...form} >
                <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="max-w-screen-lg mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-8 md:gap-10 mt-6">

                            <div className="col-span-4 flex flex-col gap-3 pr-18">

                                {/*  Div for Avatar and Constant Details */}
                                <div className="flex flex-row gap-x-20">
                                    <FormField
                                        control={form.control}
                                        name="imageSrc"
                                        render={({ field, formState }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                    <ImageUpload
                                                        disabled={isLoading}
                                                        onChange={(url) => field.onChange(url)}
                                                        value={field.value}
                                                        justify_place="justify-center items-center"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col gap-3 w-1/2">
                                        <span className="flex flex-row gap-3 mb-5">
                                            <Button className="w-2/3 rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white transition-all ease-out duration-300"
                                                type="submit" disabled={isLoading} >
                                                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                                Register
                                            </Button>
                                        </span>
                                        <FormField
                                            control={form.control}
                                            name="Year"
                                            render={({ field, formState }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="flex gap-2 items-center"><MdOutlineCalendarMonth size={18} />Year of Joining *</FormLabel>
                                                    <FormControl>
                                                        {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                        <Input required type="number" {...field} disabled={isLoading} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="Program"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="flex gap-2 items-center"><PiGraduationCapDuotone size={18} />Degree *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a verified email to display" {...field} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {courseOptions.map((course) => (
                                                                <SelectItem key={course} value={course}>
                                                                    {course}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </div>

                                {/*  Area for Social Accounts Details and inputs */}
                                <Heading
                                    heading1="Your Social Handles"
                                />
                                <FormField
                                    control={form.control}
                                    name="SocialLinks.LinkedInLink"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-row gap-2">
                                            <FormLabel className="w-1/2 flex gap-2 items-center"><BsLinkedin size={18} />Linked Account</FormLabel>
                                            <FormControl>
                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                <Input type="url" placeholder="https://linkedin.com" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="SocialLinks.GitHubLink"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-row gap-2">
                                            <FormLabel className="w-1/2 flex gap-2 items-center"><BsGithub size={18} />Github Account</FormLabel>
                                            <FormControl>
                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                <Input type="url" placeholder="https://github.com" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="SocialLinks.LeetCodeLink"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-row gap-2">
                                            <FormLabel className=" w-1/2 flex gap-2 items-center"><SiLeetcode size={18} />LeetCode Account</FormLabel>
                                            <FormControl>
                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                <Input type="url" placeholder="https://leetcode.com" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="SocialLinks.MediumLink"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-row gap-2">
                                            <FormLabel className="w-1/2 flex gap-2 items-center"><BsMedium size={18} />Medium Account</FormLabel>
                                            <FormControl>
                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                <Input type="url" placeholder="https://medium.com" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="SocialLinks.TwitterLink"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-row gap-2">
                                            <FormLabel className="w-1/2 flex gap-2 items-center"><SiTwitter size={18} />Twitter Account</FormLabel>
                                            <FormControl>
                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                <Input type="url" placeholder="https://medium.com" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="SocialLinks.Resume"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-row gap-2">
                                            <FormLabel className="w-1/2 flex gap-2 items-center"><HiOutlineDocumentSearch size={18} />Your Resume / CV</FormLabel>
                                            <FormControl>
                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                <Input type="url" placeholder="https://medium.com" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            {/* End of Social Account Section  */}


                            <div className="order-first mb-10 md:order-last md:col-span-4 ">

                                {/* Div for Personal Important Details */}
                                <div className="flex flex-col gap-2">
                                    <Heading
                                        title="Your Personal Profile"
                                    />
                                    <FormField
                                        control={form.control}
                                        name="Name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex gap-3 items-center"><HiOutlineUser size={16} />Name *</FormLabel>
                                                <FormControl>
                                                    {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                    <Input type="text" placeholder="Name" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex gap-3 items-center"><MdAlternateEmail size={16} />Email *</FormLabel>
                                                <FormControl>
                                                    {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                    <Input type="email" placeholder="johndoe@email.com" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {getYear(form.getValues('Year'))[0] !== 'Alumni' &&                                    
                                        <div className="flex flex-row gap-4">
                                            <FormField
                                                control={form.control}
                                                name="RollNo"
                                                render={({ field, formState }) => (
                                                    <FormItem className="w-1/2">
                                                        <FormLabel className="flex gap-2 items-center"><Tb123 size={22} />Roll Number *</FormLabel>
                                                        <FormControl>
                                                            {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                            <Input required type="number" {...field} disabled={isLoading} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="RegistrationNo"
                                                render={({ field }) => (
                                                    <FormItem className="w-1/2">
                                                        <FormLabel className="flex gap-2 items-center"><Tb123 size={22} />Registration Number *</FormLabel>
                                                        <FormControl>
                                                            {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                            <Input type="number" {...field} disabled={isLoading} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    }
                                    <FormField
                                        control={form.control}
                                        name="Stream"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex gap-2 items-center"><PiGraduationCapDuotone size={18} />Stream *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your Stream" {...field} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {streamOptions[form.getValues('Program')].map((stream) => (
                                                            <SelectItem key={stream} value={stream}>
                                                                {stream}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="About"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex gap-3 items-center"><BsTrophy size={16} />About / Show Case Your Achievements</FormLabel>
                                                <FormControl>
                                                    {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                    <Input type="text" placeholder="About You and Achievements" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {getYear(form.getValues('Year'))[0] === 'Alumni' && <><Heading
                                        title="Update About Your Carrer"
                                    />
                                        <div className="flex flex-row gap-4">
                                            <FormField
                                                control={form.control}
                                                name="carrer_status"
                                                render={({ field }) => (
                                                    <FormItem className="w-1/2">
                                                        <FormLabel className="flex gap-2 items-center">Career Status *</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Carrer Options" {...field} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {carrerOptions.map((options) => (
                                                                    <SelectItem key={options} value={options}>
                                                                        {options}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="industry"
                                                render={({ field }) => (
                                                    <FormItem className="w-1/2">
                                                        <FormLabel className="flex gap-2 items-center">Industry *</FormLabel>
                                                        <FormControl>
                                                            {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                            <Input {...field} disabled={isLoading} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {form.getValues('carrer_status') === 'Higher Studies' ? (
                                                <div className="flex flex-row gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="higher_study_degree"
                                                    render={({ field, formState }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel className="flex gap-2 items-center">Higher Study Degree *</FormLabel>
                                                            <FormControl>
                                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                                <Input {...field} disabled={isLoading} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="university"
                                                    render={({ field }) => (
                                                        <FormItem className="w-1/2">
                                                            <FormLabel className="flex gap-2 items-center">University *</FormLabel>
                                                            <FormControl>
                                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                                <Input {...field} disabled={isLoading} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            ):(
                                                <div className="flex flex-row gap-4">
                                            <FormField
                                                control={form.control}
                                                name="job_title"
                                                render={({ field, formState }) => (
                                                    <FormItem className="w-1/2">
                                                        <FormLabel className="flex gap-2 items-center">Job Title</FormLabel>
                                                        <FormControl>
                                                            {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                            <Input  {...field} disabled={isLoading} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="company"
                                                render={({ field }) => (
                                                    <FormItem className="w-1/2">
                                                        <FormLabel className="flex gap-2 items-center">Company Name</FormLabel>
                                                        <FormControl>
                                                            {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                            <Input  {...field} disabled={isLoading} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                            )

                                        }
                                    </>
                                    }
                                </div>
                            </div>

                            {/*  End of Profile Section */}
                        </div>
                    </div>
                </form>
            </Form>
        </ >
    );
}

export default RegisterStudentClient;
