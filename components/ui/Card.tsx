import { ReactNode } from "react";
import clsx from "clsx";

interface Props{
    children:ReactNode;
    className?:string;
}

export default function Card({children,className}:Props){

    return(

        <div
        className={clsx(

            "bg-white",
            "rounded-2xl",
            "border",
            "border-slate-200",
            "shadow-sm",
            "p-6",

            className

        )}>

            {children}

        </div>

    )

}