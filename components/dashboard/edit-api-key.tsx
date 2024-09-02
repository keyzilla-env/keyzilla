"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
const formSchema = z.object({
    apiKeyValue: z.string().min(1, "API Key is required"),
    isServer: z.boolean()
});

export default function EditApiKey({ apiKeyId, isOpen, onOpenChange, apiKeyName }: { apiKeyId: Id<"apiKeys">, isOpen: boolean, onOpenChange: (isOpen: boolean) => void, apiKeyName: string }) {
    const updateApiKey = useMutation(api.apiKeys.updateApiKey);
    const deleteApiKey = useMutation(api.apiKeys.deleteApiKey);
    const [isDeleting, setIsDeleting] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            apiKeyValue: "",
            isServer: false
        },
    });

    const handleDeleteApiKey = async () => {
        try {
            setIsDeleting(true)
            await deleteApiKey({ apiKeyId });
            toast.success("API Key deleted successfully");
            setIsDeleting(false)
            onOpenChange(false);
        } catch (error) {
            setIsDeleting(false)
            toast.error("Failed to delete API Key");
        }
    };

    const handleUpdateApiKey = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateApiKey({ apiKeyId, value: values.apiKeyValue, isServer: values.isServer });
            toast.success("API Key updated successfully");
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to update API Key");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Edit API Key</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateApiKey)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="apiKeyValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">API Key</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter new API key value" className="mt-1" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isServer"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center space-x-2">
                                        <FormLabel className="text-sm font-medium">Server Key</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <SwitchTooltip />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-fulle">Update API Key</Button>
                    </form>
                </Form>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Danger Zone</AlertTitle>
                    <AlertDescription>
                        Deleting this project will permanently remove all the following api key
                        {apiKeyName}
                        <div
                            className="mt-3 flex justify-end items-end"
                        >
                            <Button
                                variant="destructive"
                                onClick={handleDeleteApiKey}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Project"}
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </DialogContent>
        </Dialog>
    );
}

function SwitchTooltip() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Info className='w-4 h-4 text-gray-500' />
                </TooltipTrigger>
                <TooltipContent>
                    <p className='text-sm max-w-[200px]'>Server API Keys are accessible only on server-side. If not set, it will be used as a client-side key.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}