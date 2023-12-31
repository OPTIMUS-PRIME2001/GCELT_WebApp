'use client';

//icons
import { BsLinkedin, BsGithub, BsMedium, BsSend } from "react-icons/bs";
import { FiPhoneCall, FiAtSign } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { PiGraduationCapDuotone } from "react-icons/pi";
import { HiOutlineDocumentSearch, HiBadgeCheck, HiOutlineClock } from "react-icons/hi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Trash2 } from "lucide-react";


// Global imports
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";


// Local imports
import {
    SafeStudent,
    SafeUser
} from "@/app/types";
import getYear from "@/lib/getYear";

//Components
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter
} from "@/app/components/ui/card";
import { LinkDialog } from "@/app/components/modals/linkDialog";
import { ConfirmationModal } from "@/app/components/modals/ConfirmationModal";



interface AlumniCardProps {
    data: SafeStudent;
    onAction?: (id: string, path: string) => void;
    onDeletion?: (id: string, path: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null
};

const AlumniCard: React.FC<AlumniCardProps> = ({
    data,
    onAction,
    onDeletion,
    disabled,
    actionLabel,
    actionId = '',
    currentUser,
}) => {

    const [Year, Sem] = getYear(data?.Year)
    const [open, setOpen] = useState(false);
    const router = useRouter();


    const handleVerify = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }
            onAction?.(actionId, 'student')
        }, [disabled, onAction, actionId]);



    const handleDelete = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }
            onDeletion?.(actionId, 'student')
        }, [disabled, onDeletion, actionId]);


    //acronym of Name
    let acronym = data?.Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');

    return (
        <Card className="select-none w-full bg-neutral-100 dark:bg-slate-900 shadow-lg hover:-translate-y-4 transition">
            <CardContent className="mt-3">
                <div className="flex justify-between space-x-4">
                    <Avatar className="w-24 h-24 aspect-square">
                        <AvatarImage src={data.imageSrc} />
                        <AvatarFallback className="bg-slate-200 dark:bg-slate-500">{acronym}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col 
                        w-full overflow-hidden ">
                        <div className="mb-3 w-full rounded-md justify-end items-center flex flex-row gap-2">
                            {(currentUser?.role === 'admin' || currentUser?.id === data.id) &&
                                <>
                                { onAction && actionLabel && (
                                    <Button
                                        size="xs"
                                        disabled={disabled}
                                        onClick={handleVerify}
                                    >{actionLabel}</Button>
                                )}
                            {!(currentUser?.id === data.id) && <><ConfirmationModal
                                isOpen={open}
                                onClose={() => setOpen(false)}
                                onConfirm={() => { handleDelete }}
                                loading={disabled}
                            />
                            <Button variant="ghost" size="sm"
                                className="text-red-600 p-0"
                                onClick={() => setOpen(true)}
                            >
                                <Trash2 size={20} />
                            </Button></>
                            }
                            <Button
                                variant="secondary"
                                size="xs"
                                disabled={disabled}
                                onClick={() => router.push(`/student/${data.id}`)}
                            >Edit</Button>
                            </>
                        }
                        {!onAction && <Button variant="ghost" size="sm"
                                className="text-white font-bold p-0"
                                onClick={() => {}}
                            >
                                <BsSend size={16} />
                            </Button>
                        }
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-1">
                                <span className="bg-purple-200  dark:bg-slate-800 p-1  
                                            font-semibold rounded-md text-purple-600 dark:text-purple-300">
                                    <HiOutlineClock size={18} />
                                </span>
                                <div className="font-light text-base">
                                    {Year} : {data?.Year + 4}
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <span className="bg-purple-200 dark:bg-slate-800 p-1 
                                        font-semibold rounded-md text-purple-600 dark:text-purple-300">
                                    <PiGraduationCapDuotone size={18} />
                                </span>
                                <div className="font-light text-base">
                                    {Sem}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="relative">
                <div className="flex flex-col w-full overflow-hidden ">
                    <div className="flex flex-row items-center gap-2">
                        <div className="font-bold text-lg">
                            {data?.Name}
                        </div>
                        {data?.verified === true &&
                            <span className="rounded-md text-green-600">
                                < VscVerifiedFilled size={20} />
                            </span>
                        }
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <span className="bg-emerald-100 dark:bg-emerald-950 p-1 rounded-md text-green-600 dark:text-green-300">
                            <FiAtSign size={16} />
                        </span>
                        <div className="font-light dark:font-semibold text-green-600 text-base ">
                            {data.email}
                        </div>
                    </div>
                    <div className="font-semibold pt-2 text-sm justify-center">
                        {data.Stream}
                    </div>
                    <div className="font-semibold text-neutral-500 dark:text-neutral-300 text-sm">
                        Carrer Status :  {data?.carrer_status}
                        <br />
                        {data.carrer_status === 'Higher Studies' ? <>
                            Degree: {data?.higher_study_degree}
                            <br/>
                            University: {data?.university}
                        </>: <>
                            Job Title: {data?.job_title}
                            <br/>
                            Company: {data?.company}
                        </>                        
                        }                        
                    </div>
                </div>
                <span className="pt-5 flex flex-col absolute gap-2 right-3 ">
                <LinkDialog title="Phone Number" description="copy" icons={<FiPhoneCall size={16} />}>{data?.phoneNum}</LinkDialog>
                    <LinkDialog title="LinkedIn Account" description="copy" icons={<BsLinkedin size={16} />}>{data?.linkedInLink}</LinkDialog>
                    <LinkDialog title="Github Account" description="copy" icons={<BsGithub size={16} />}>{data?.githubLink}</LinkDialog>
                    <LinkDialog title="Leetcode Account" description="copy" icons={<SiLeetcode size={16} />}>{data?.leetCodeLink}</LinkDialog>
                    <LinkDialog title="Resume / CV" description="copy" icons={<HiOutlineDocumentSearch size={18} />} >{data?.resume}</LinkDialog>

                </span>
            </CardFooter>
        </Card>
    );
}

export default AlumniCard;