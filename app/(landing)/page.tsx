import Link from "next/link";

const LandingPage = () => {
    return (
        <div>
            Landing page
            <div>
                <Link href="/sign-in">
                    Login
                </Link>

                <Link href="/sign-up">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;