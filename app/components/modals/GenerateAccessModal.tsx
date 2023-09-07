// icons
import { HiOutlineTicket } from "react-icons/hi";
import { Copy, CopyCheck } from "lucide-react"

// Global imports
import axios from "axios";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { useGenerate } from "@/hooks/useGenerate";
import { Modal } from "@/app/components/customUi/modal";

// Validation with zod for registerschema , only works with signup schema
const accessCodeSchema = z.object({
    code: z.string().min(10), //.optional().transform(e => e === "" ? undefined : e) , // atleast 3 character is required to properly name our store
});


// The main Component
const GenerateAccessModal = () => {
    const accessModal = useGenerate();
    const router = useRouter();

    //All States Controller
    const [data, setData] = useState<any>([]);
    // state to control Loading condition  , disable trigger when so submission take place
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // state to control is copied icon visibility   
    const [copied, setCopied] = useState(false);
    //state to control children/ text to be 
    const [children, setChildren] = useState<string>(accessModal.accessCode);

    // Use useEffect to update `vari` when `registerModal.variant` changes
    useEffect(() => {
        setChildren(accessModal.accessCode);
    }, [accessModal.accessCode]);


    //TODO:  Need to correct here
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(children);
        // navigator.clipboard.writeText(accessModal.accessCode);
        setCopied(true);
    };


    // useform function provided by react-hook-form
    const form = useForm<z.infer<typeof accessCodeSchema>>({
        resolver: zodResolver(accessCodeSchema),
        defaultValues: {
            code: "",
        },
    })

    //The main onSubmit function triggers when continue button clicked
    const onSubmit = async (data: z.infer<typeof accessCodeSchema>) => {
        setIsLoading(true);

        const result = await axios.patch('/api/refferalcode', data)
            .then(() => {
                toast.success('Role Upgraded to Teacher!');
                router.refresh();
                form.reset();
            })
            .catch(() => {
                toast.error('Something went wrong.');
            })
            .finally(() => {
                setIsLoading(false);
            })


    }


    return (

        <Modal
            title="Access Code"
            description="This is a Secret Access Code generated for Upgrading Roles. Don't Forward to Unusual Users"
            isOpen={accessModal.isOpen}
            onClose={accessModal.onClose}
        >
            <div className="space-y-4 py-2 pb-4">
                {accessModal.role === 'admin' ? (
                    <>
                        <div className="flex space-x-2 items-center">
                            <Input value={accessModal.accessCode} readOnly className="w-full relative outline-none focus:outline-transparent" />
                            <Button onClick={handleCopyToClipboard} variant="secondary"
                                size="sm" className="shrink-0 absolute right-6 ">
                                Copy {copied ? <CopyCheck className="ml-2 text-green-500" /> : <Copy className="ml-2" />}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Form {...form} >
                            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>

                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Access Code</FormLabel>
                                            <FormControl>
                                                {/* Spread onBlur , onChange , value , name , ref by using ...field , and thus we handle all those fields*/}
                                                <Input type="text" placeholder="Enter Your Access Code Here" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="pt-2 space-x-2 w-full flex justify-end">
                                    <Button className="flex flex-row gap-3 font-bold" type="submit" disabled={isLoading}><HiOutlineTicket size={18} />Continue</Button>

                                </div>
                            </form>
                        </Form>
                    </>
                )}

            </div>
        </Modal>

    )
}
export default GenerateAccessModal;