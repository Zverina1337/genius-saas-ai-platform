import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";

const LandingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    const {userId} = auth()

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