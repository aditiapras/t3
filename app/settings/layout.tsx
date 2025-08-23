import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
    ArrowLeft,
    Brain,
    Eye,
    Files,
    GitBranch,
    Globe,
    Search,
    Settings2,
    SlidersHorizontal,
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import ModelForm from "@/components/model-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getModels } from "./actions";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { sessionClaims } = await auth();
    const models = await getModels();
    return (
        <div className="flex flex-col w-full md:max-w-5xl lg:max-w-4xl mx-auto min-h-screen p-4">
            <div className="flex items-center justify-between">
                <Link href="/chat">
                    <Button variant={"ghost"}>
                        <ArrowLeft />
                        Back to Chat
                    </Button>
                </Link>
                <UserButton />
            </div>
            <div className="mt-10">
                <Tabs
                    defaultValue="customise"
                    className="text-sm text-muted-foreground"
                >
                    <TabsList variant="line">
                        <TabsTrigger value="customise">
                            <SlidersHorizontal /> Customize
                        </TabsTrigger>
                        <TabsTrigger value="models">
                            <GitBranch />
                            Models
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="customise">
                        <div className="flex flex-col w-full gap-2">
                            <p className="text-xl font-semibold mt-5">Customise T3 Chat</p>
                            <Form action="" className="flex flex-col gap-8 mt-5">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">What should T3 Chat call you?</Label>
                                    <Input type="text" name="name" id="name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">What do you do?</Label>
                                    <Input type="text" name="name" id="name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">What traits should T3 Chat have?</Label>
                                    <Input type="text" name="name" id="name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">
                                        Anything else T3 Chat should know about you?
                                    </Label>
                                    <Textarea name="name" id="name" className="resize-none" />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Save</Button>
                                </div>
                            </Form>
                        </div>
                    </TabsContent>
                    <TabsContent value="models">
                        {sessionClaims?.role === "admin" && (
                            <div className="flex justify-end">
                                <ModelForm />
                            </div>
                        )}
                        <div className="flex flex-col w-full gap-2">
                            <p className="text-xl font-semibold mt-5">Available Models</p>
                            <p>
                                Here you can select the model you want to use for your chat.
                            </p>
                            <div className="relative mt-5">
                                <Search className="absolute top-1/2 -translate-y-1/2 left-2 size-4 " />
                                <Input
                                    type="text"
                                    placeholder="Find Model Name"
                                    className="relative pl-10"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-5 mt-5">
                                {models.map((model) => {
                                    return (
                                        <Card key={model.id}>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle className="line-clamp-1">
                                                            {model.name}
                                                        </CardTitle>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {model.provider}
                                                    </p>
                                                </div>
                                                <Tooltip>
                                                    <CardDescription className="text-sm mt-2 text-left line-clamp-2">
                                                        {model.description}
                                                    </CardDescription>
                                                </Tooltip>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {model.supportReasoning && (
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <div className="rounded-full p-2 border bg-pink-200">
                                                                        <Brain className="size-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Has reasoning capabilities</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {model.supportImage && (
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <div className="rounded-full p-2 border bg-green-200">
                                                                        <Eye className="size-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Supports image</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {model.supportFile && (
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <div className="rounded-full p-2 border bg-blue-200">
                                                                        <Files className="size-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Supports file</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {model.supportWebSearch && (
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <div className="rounded-full p-2 border bg-purple-200">
                                                                        <Globe className="size-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Supports web search</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                    <Button variant="ghost" size="icon">
                                                        <Settings2 />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            {children}
        </div>
    );
}
