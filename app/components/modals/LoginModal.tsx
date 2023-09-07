'use client'
// icons
import { FcGoogle } from "react-icons/fc";

// Global imports
import axios from "axios";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Local imports
// Components
import { Button } from '@/app/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { useRegisterModal } from "@/hooks/useRegisterModal";
import { Modal } from "@/app/components/customUi/modal";




type Variant = 'LOGIN' | 'REGISTER';

// Validation with zod for registerschema , only works with signup schema
const registerSchema = z.object({
    name: z.string().min(3), //.optional().transform(e => e === "" ? undefined : e) , // atleast 3 character is required to properly name our store
    email: z.string().email(),
    password: z.string().min(4),
    variant: z.literal("REGISTER"),
});
// Validation loginschema , only works with login layout
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
    variant: z.literal("LOGIN"),
});



// The main Component
const LogInModal = () => {
    const registerModal = useRegisterModal();
    // To maintain session as need to redirect when singin process is done 
    const session = useSession();
    // router from next navigation to push routes path 
    const router = useRouter();
    // state to control variant of form
    const [variant, setvariant] = useState<Variant>(registerModal.variant);
    // state to control Loading condition  , disable trigger when so submission take place
    const [isLoading, setIsLoading] = useState(false);

    // Use useEffect to update `variant` when `registerModal.variant` changes
    // if we authenticated to our session then show main page or stay in current page of login
    useEffect(() => {
        if (session?.status === 'authenticated') {
            toast.success('LoggedIn!');
            router.push('/register')
        }
        else{
            router.push('/') 
        }
        setvariant(registerModal.variant);
    }, [session?.status, router, registerModal.variant]);

    // Function to toggle between variant of Login and Register card
    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN' ) {
            setvariant('REGISTER');
        } else {
            setvariant('LOGIN');
        }

    }, [variant]);

    // defining union formSchema which will toggle according to variant state
    const formSchema = z.discriminatedUnion("variant", [registerSchema, loginSchema]);

    // useform function provided by react-hook-form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            variant: "REGISTER",
        },
    })

    //The main onSubmit function triggers when continue button clicked
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        if (variant === 'LOGIN') {
            //NextAuth SignIN
            signIn('credentials', {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.ok) {
                        //To check the url's storeid if present inside datanase and if present then fetch it
                        registerModal.onClose();                        
                        router.push('/register');
                    }

                    if (callback?.error) {
                        toast.error(callback.error);
                    }
                })
                .finally(() =>
                    setIsLoading(false)
                )
        }

        if (variant === 'REGISTER') {
            await axios.post('/api/register', data)
            signIn('credentials', {
                ...data,
                redirect: false,
            })
                .then(() => {
                    toast.success('Registered!');
                    registerModal.onClose();
                    router.push('/register');
                })
                .catch((error) => {
                    toast.error(error);
                })
                .finally(() =>
                    setIsLoading(false)
                )
        }
    }


    return (

        <Modal
            title={variant === 'LOGIN' ? 'SignIn! ' : 'SignUp! Create an account'}
            description={variant === 'LOGIN' ? 'Enter your credentials to Login into your account' : 'Enter your email below to create your account'}
            isOpen={registerModal.isOpen}
            onClose={registerModal.onClose}
        >
            <div className="space-y-4 py-2 pb-4">
                <Form {...form} >
                    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                        {variant === 'REGISTER' && <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                        <Input type="email" placeholder="johndoe@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-2 space-x-2 w-full">
                            <Button className="w-full" onClick={() => form.setValue("variant", variant)} type="submit" disabled={isLoading}>Continue</Button>

                        </div>
                    </form>
                </Form>


                <div className="flex flex-col">
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-muted-foreground"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button className="w-full flex gap-3" onClick={() => signIn('google')}><FcGoogle size={18} /> Continue with google</Button>

                    <div className="mt-6 px-2 flex gap-2 justify-center text-sm text-gray-500">
                        <span>{variant === 'LOGIN' ? 'No Account?' : 'Already have an account'}</span>
                        <span className="underline cursor-pointer text-blue-900" onClick={toggleVariant}>
                            {variant === 'LOGIN' ? 'Create an Account' : 'logIn'}
                        </span>
                    </div>
                </div>
            </div>
        </Modal>

    )
}
export default LogInModal;