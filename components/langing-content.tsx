"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name: "Kirill",
        avatar: "K",
        title: "Wordpress Developer",
        description: "OMG! This is amazing! I solve my problem in 3 minutes, then default 10 years!"
    },
    {
        name: "Sasha",
        avatar: "S",
        title: "Back-end Developer",
        description: "I love JavaScript! The best programming language I have ever seen!"
    },
    {
        name: "Daniel",
        avatar: "D",
        title: "Front-end Developer",
        description: "The best piano solo! Genius is good!"
    },
    {
        name: "Ivan",
        avatar: "I",
        title: "Tester??",
        description: "This is the best thing. I can ask everything!"
    },
]

const LandingContent = () => {
    return (
        <div className="
                px-10
                pb-20
            "
        >
            <h2 className="
                    text-center
                    text-4xl
                    text-white
                    font-extrabold
                    mb-10
                "
            >
                Testimonials.
            </h2>
            <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                "
            >
                {testimonials.map((item) => (
                    <Card
                        key={item.description}
                        className="
                            bg-[#192339]
                            border-none
                            text-white
                        "
                    >
                        <CardHeader>
                            <CardTitle className="
                                    flex
                                    items-center
                                    gap-x-2
                                "
                            >
                                <p className="
                                        text-lg
                                    "
                                >
                                    {item.name}
                                </p>
                                <p className="
                                        text-zinc-400
                                        text-sm
                                    "
                                >
                                    {item.title}
                                </p>
                            </CardTitle>
                            <CardContent className="
                                    pt-4
                                    px-0
                                "
                            >
                                {item.description}
                            </CardContent>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LandingContent;