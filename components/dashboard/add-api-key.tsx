"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Id } from '@/convex/_generated/dataModel'
import { Info, Loader2 } from 'lucide-react'
import { Switch } from '../ui/switch'

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    apiKey: z.string().min(1, 'API Key is required'),
    isServer: z.boolean()
})

interface AddApiKeyProps {
    projectId: Id<"projects">
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function AddApiKey({ projectId, isOpen, onOpenChange }: AddApiKeyProps) {
    const [Loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            apiKey: '',
            isServer: false
        },
    })

    const createApiKey = useMutation(api.apiKeys.createApiKey)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            await createApiKey({ projectId, value: values.apiKey })
            setLoading(false)
            toast.success("API Key created successfully")
            form.reset()
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to create API Key")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default">Add API Key</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add API Key</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="API Key Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="apiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>API Key</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter API Key"  {...field} />
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
                                    <FormLabel> Server Key</FormLabel>
                                    <FormControl>
                                        <div className='flex items-center space-x-2 justify-between'>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <SwitchTooltip />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">{Loading ? <Loader2 className='animate-spin' /> : "Create"}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


function SwitchTooltip() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Info className='w-4 h-4' />
                </TooltipTrigger>
                <TooltipContent>
                    <p className='text-sm  max-w-[200px]' >Server API Keys are accessible only on server-side  if not set it will be accessible on client-side only</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}