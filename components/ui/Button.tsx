import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
    loading?:boolean;
}

export default function Button({

    className,

    loading,

    children,

    ...props

}:Props){

    return(

        <button

        {...props}

        className={clsx(

            "bg-blue-600",

            "hover:bg-blue-700",

            "text-white",

            "rounded-xl",

            "px-5",

            "py-3",

            "font-semibold",

            "transition",

            "disabled:opacity-50",

            className

        )}>

            {loading?"Loading...":children}

        </button>

    )

}