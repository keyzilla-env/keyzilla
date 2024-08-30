'use client'

import { useOrganizationList } from '@clerk/nextjs'
import { FormEventHandler, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { InviteMember } from './invite-user'
import { Skeleton } from '../ui/skeleton'

export default function CreateOrganization() {
    const { createOrganization } = useOrganizationList()
    const [organizationName, setOrganizationName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showInvite, setShowInvite] = useState(false)
    const router = useRouter()

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await createOrganization!({ name: organizationName })
        setIsLoading(false)
        setShowInvite(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        setShowInvite(false)
        setOrganizationName('')
        router.refresh()
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className='my-4 ml-2' >
                    <PlusIcon className='w-4 h-4' />
                    Create Organization
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{showInvite ? 'Invite Members' : 'Create Organization'}</DialogTitle>
                    <DialogDescription>
                        {showInvite ? 'Invite members to your new organization.' : 'Enter a name for your new organization.'}
                    </DialogDescription>
                </DialogHeader>
                {!showInvite ? (
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <Input
                                id="organizationName"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                placeholder="Organization Name"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading || !organizationName}>
                                {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Create'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        <InviteMember />
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleClose}>Done</Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

