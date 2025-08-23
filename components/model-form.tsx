"use client";

import { Split } from "lucide-react";
import Form from "next/form";
import { addModel } from "@/app/settings/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ModelForm() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    <Split /> Add Model
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add New Model</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please fill in the form below to add a new model.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form action={addModel} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input type="text" name="model" required placeholder="Model" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="modelId">Model ID</Label>
                        <Input type="text" name="modelId" required placeholder="Model ID" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Model Description</Label>
                        <Textarea
                            name="description"
                            required
                            placeholder="Model Description"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                        <Input
                            type="text"
                            name="provider"
                            required
                            placeholder="Provider"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="col-span-2">Capabilities</p>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="supportImage" id="supportImage" />
                            <Label htmlFor="supportImage">Support Image</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="supportFile" id="supportFile" />
                            <Label htmlFor="supportFile">Support File</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="supportWebSearch" id="supportWebSearch" />
                            <Label htmlFor="supportWebSearch">Support Websearch</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="hasReasoning" id="hasReasoning" />
                            <Label htmlFor="hasReasoning">Has Reasoning</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="isPremium" id="isPremium" />
                            <Label htmlFor="isPremium">Is Premium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="freeModel" id="freeModel" />
                            <Label htmlFor="freeModel">Free Model</Label>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button type="submit">
                                Add Model
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
