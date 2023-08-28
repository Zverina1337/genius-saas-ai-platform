"use client"

import * as z from "zod"
import Heading from "@/components/heading";
import {ImageIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {amountOptions, formSchema} from "./constants";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useState} from "react";
import requestManager from "@/fetcher";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import {cn} from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ImagePage = () => {
    const router = useRouter()
    const [images, setImages] = useState<string[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512",
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>)=> {
        try {
            setImages([])

            const response = await requestManager("/api/image", "POST",values)

            const urls = response.map((image: { url: string }) => image.url)

            setImages(urls)
            form.reset()
        } catch (error) {
            // TODO: Open Pro Modal
            console.log(error)
        } finally {
            router.refresh()
        }
    }

    return (
        <div>
            <Heading
                title="Image generation"
                description="Turn your prompt into an image"
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
            />
            <div className="
                    px-4
                    lg:px-8
                "
            >
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                                border
                                rounded-lg
                                w-full
                                p-4
                                px-3
                                md:px-6
                                focus-within:shadow-sm
                                grid
                                grid-cols-12
                                gap-2
                            "
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="
                                            col-span-12
                                            lg:col-span-10
                                        "
                                    >
                                        <FormControl className="
                                                m-0
                                                p-0
                                            "
                                        >
                                            <Input
                                                className="
                                                    border-0
                                                    outline-none
                                                    focus-visible:ring-0
                                                    focus-visible:ring-transparent
                                                "
                                                disabled={isLoading}
                                                placeholder="A picture of a horse in Swiss alps"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="
                                            col-span-12
                                            lg:col-span-2
                                        "
                                    >
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="
                                    col-span-12
                                    lg:col-span-2
                                    w-full
                                "
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="
                                p-20
                            "
                        >
                            <Loader/>
                        </div>
                    )}
                    {images.length === 0 && !isLoading && (
                        <Empty
                            label="No images generated"
                        />
                    )}
                    <div className="
                            flex
                            flex-col
                            gap-y-4
                        "
                    >
                        <div>
                            Images will be rendered here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePage;