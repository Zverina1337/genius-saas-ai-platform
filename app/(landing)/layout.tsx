import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

const LandingLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const {userId} = await auth()

    if (userId) redirect("/dashboard")

    return (
        <main className="
                h-full
                bg-[#111827]
                overflow-auto
            "
        >
            <div className="
                    mx-auto
                    max-w-screen-xl
                    h-full
                    w-full
                "
            >
                {children}
            </div>
        </main>
    );
};

export default LandingLayout;