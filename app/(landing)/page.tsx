import LandingHero from "@/components/landing-hero";
import LandingNavbar from "@/components/landing-navbar";
import LandingContent from "@/components/langing-content"
const LandingPage = () => {
    return (
       <div className="h-full">
           <LandingNavbar/>
           <LandingHero/>
           <LandingContent/>
       </div>
    );
};

export default LandingPage;