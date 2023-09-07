'use client';
//icons
import {
    Settings,
    LogIn,
    LogOut,
    Menu,
    UserPlus2,
    CalendarCheck,
    ThumbsUp,
    ThumbsDown
} from "lucide-react";
import { TbCircleFilled } from "react-icons/tb";
import {
    PiStudentBold,
    PiExamDuotone,
    PiChalkboardTeacherDuotone
} from "react-icons/pi"


// Global import
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// Local imports
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { ThemeModeToggle } from "@/app/components/customUi/themeToggler";

import { SafeUser } from "@/app/types";
import { useRegisterModal } from "@/hooks/useRegisterModal";
import { useGenerate } from "@/hooks/useGenerate";
import { getFirstLettersOfWords } from "@/lib/getYear";


interface UserMenuProps {
    currentUser?: SafeUser | null;
}

export default function UserMenu({ currentUser }: UserMenuProps) {

    const registerModal = useRegisterModal();
    const accessCodeModal = useGenerate();
    const router = useRouter();

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={() => { }}
                    className="
                        hidden
                        md:block
                        text-sm 
                        font-semibold 
                        py-3 
                        px-4 
                        rounded-full 
                        hover:bg-neutral-100 
                        dark:hover:bg-slate-900
                        transition 
                        cursor-pointer
                    "
                >
                    {currentUser ? currentUser.role === "admin" ? (
                        <div className="flex flex-row justify-between items-center gap-2">
                            <TbCircleFilled className="text-green-500" />Admin Portal
                        </div>
                    ) : currentUser.role === "teacher" ? (
                        <div className="flex flex-row justify-between items-center gap-2">
                            <TbCircleFilled className="text-green-500" />Faculty Portal
                        </div>
                    ) : (
                        <div className="flex flex-row justify-between items-center gap-2">
                            <TbCircleFilled className="text-green-500" />Student Portal
                        </div>
                    ) : "View Mode"}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >

                        <Button variant="ghost" className="flex-row gap-3 justify-between 
                        md:py-1
                        md:px-2
                        border-[1px] 
                        shadow-md
                        border-neutral-200 
                        dark:border-neutral-600
                        rounded-full
                        ">
                            <Menu size={24} className="ml-2" />
                            {currentUser ? (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={currentUser?.image || '/avatars/01.png'} alt="@shadcn" />
                                    <AvatarFallback className="bg-green-600  text-white ">{getFirstLettersOfWords(currentUser?.name? currentUser.name: "A")}</AvatarFallback>
                                </Avatar>
                            ) : (<div className="mr-2">Login</div>)
                            }

                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        {currentUser && <>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-row space-x-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser?.image || '/avatars/01.png'} alt="@shadcn" />
                                        <AvatarFallback>{getFirstLettersOfWords(currentUser?.name? currentUser.name: "A")}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />
                        </>}
                        <DropdownMenuGroup className="block lg:hidden text-neutral-600">
                            <DropdownMenuItem onClick={() => router.push('/')}>
                                <PiStudentBold className="mr-2 h-4 w-4" /> Students
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/faculty')}>
                                <PiChalkboardTeacherDuotone className="mr-2 h-5 w-5" /> Faculty
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/roles')}>
                                <CalendarCheck className="mr-2 h-4 w-4" /> Routine
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/roles')}>
                                <PiExamDuotone className="mr-2 h-5 w-5" /> Exams
                            </DropdownMenuItem>

                        </DropdownMenuGroup>
                        <DropdownMenuGroup className="text-neutral-600 dark:text-neutral-500 my-3">
                            {currentUser ? currentUser.role === "admin" ? (
                                <>
                                    <DropdownMenuItem onClick={() => router.push('/roles')}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Manage Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/verification')}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Verify User Cards
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => accessCodeModal.onOpen(currentUser.role)}>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Generate Access Code
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { signOut() }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => { }}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Manage Account
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => { signOut() }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => registerModal.onOpen('LOGIN')}>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        LogIn
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => registerModal.onOpen('REGISTER')}>
                                        <UserPlus2 className="mr-2 h-4 w-4" />
                                        SignUp
                                    </DropdownMenuItem></>
                            )
                            }
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScdBCKp4Zx-I4XCfS0LW7jJkegTPzo1HWmdOv_yS6DxjRXMqw/viewform?usp=sf_link','_blank')}>
                                <><ThumbsUp className="h-4 w-4" /><ThumbsDown className="mr-2 h-4 w-4" /></>
                                Report / Feedback
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <div className="m-2 font-light text-neutral-400 text-xs">
                            Secured by @nextauth
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ThemeModeToggle />
            </div>
        </div>
    )
};