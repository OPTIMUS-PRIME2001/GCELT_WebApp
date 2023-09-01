"use client"

//icons
import { MdAlternateEmail, MdOutlineCalendarMonth } from "react-icons/md";

// Global imports
import { ColumnDef } from "@tanstack/react-table";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

// Local imports
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
//types
import { SafeUser } from "@/app/types";
// Components
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";





// We need to specify Coloumns name and also specify how rows renders
export const columns: ColumnDef<SafeUser>[] = [
    // checkbox
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    // avatar images
    {
        accessorKey: "image",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Avatar" />
        ),
        cell: ({ row }) => <span className="max-w-12"><Avatar className="h-8 w-8">
            <AvatarImage src={row.getValue("image") || '/avatars/01.png'} alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
        </Avatar></span>,
        enableSorting: false,
        enableHiding: false,
    },


    // names
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
            return (
                <span className="max-w-[80px] truncate font-medium">
                    {row.getValue("name")}
                </span>
            )
        },
    },


    // email 
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="email" />
        ),
        cell: ({ row }) => {

            return (
                <div className="flex w-[250px] items-center truncate">
                    <MdAlternateEmail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{row.getValue("email")}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    // created At 
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="created At" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex  w-[250px] items-center">
                    <MdOutlineCalendarMonth className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>{row.getValue("createdAt")}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    // Roles Button 
    {
        id:"role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Roles" />
        ),
        cell: Cell,
        enableSorting: false,
        enableHiding: false,
    },

    // actions
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]

function Cell({ row } : any) {
        const user = row.original
        const [assignRoleId, setAssignRoleId] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const router = useRouter();
        const onAssign = useCallback(
            (id: string, role: string) => {
                setAssignRoleId(id);
                setIsLoading(true);
                const data = { role };
                // Request
                axios
                    .post(`/api/role/${id}`, data)
                    .then(() => {
                        toast.success("Successfully Role assigned to user ");
                        router.refresh();
                    })
                    .catch((error) => {
                        toast.error(error?.response?.statusText);
                        console.error(error);
                    })
                    .finally(() => {
                        setAssignRoleId("");
                        setIsLoading(false);
                    });
            },
            [router]
        );



        return (
            <div className="col-span-3 flex flex-row gap-0 text-base">
                <Button
                    variant={`${user.role === 'student'?"default":"outline"}`}
                    className={`${user.role === 'student'?"bg-violet-700 dark:text-white":"bg-transparent"}
                    rounded-l-full hover:bg-violet-700 hover:border-violet-700`}
                    size="sm"
                    onClick={() => onAssign(user.id, 'student')}
                >Student</Button>
                <Button
                    variant={`${user.role === 'teacher'?"default":"outline"}`}
                    className={`${user.role === 'teacher'?"bg-violet-700 dark:text-white":"bg-transparent"}
                    rounded-none hover:bg-violet-700 hover:border-violet-700`}
                    size="sm"
                    onClick={() => onAssign(user.id, 'teacher')}
                >Teacher</Button>
                <Button
                    variant={`${user.role === 'admin'?"default":"outline"}`}
                    className={`${user.role === 'admin'?"bg-violet-700 dark:text-white":"bg-transparent"}
                    rounded-r-full hover:bg-violet-700 hover:border-violet-700`}
                    size="sm"
                    onClick={() => onAssign(user.id, 'admin')}
                >Admin</Button>
            </div>
        )
    }
