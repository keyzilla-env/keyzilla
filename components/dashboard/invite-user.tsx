'use client'

import { useOrganization } from '@clerk/nextjs'
import { OrganizationCustomRoleKey } from '@clerk/types'
import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const OrgMembersParams = {
    memberships: {
        pageSize: 5,
        keepPreviousData: true,
    },
}

export const OrgInvitationsParams = {
    invitations: {
        pageSize: 5,
        keepPreviousData: true,
    },
}

// Form to invite a new member to the organization.
export const InviteMember = () => {
    const { isLoaded, organization, invitations } = useOrganization(OrgInvitationsParams)
    const [emailAddress, setEmailAddress] = useState('')
    const [disabled, setDisabled] = useState(false)

    if (!isLoaded || !organization) {
        return null
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const formData = new FormData(form)
        const email = formData.get('email') as string
        const role = formData.get('role') as OrganizationCustomRoleKey

        if (!email || !role) {
            return
        }

        setDisabled(true)
        try {
            await organization.inviteMember({
                emailAddress: email,
                role: role,
            })
            await invitations?.revalidate
            setEmailAddress('')
        } catch (error) {
            console.error('Error inviting member:', error)
            // Handle error (e.g., show error message to user)
        } finally {
            setDisabled(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invite New Member</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <SelectRole fieldName="role" />
                    </div>
                    <Button type="submit" disabled={disabled} className="w-full">
                        Invite Member
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

type SelectRoleProps = {
    fieldName?: string
    isDisabled?: boolean
    onChange?: (value: string) => void // Changed from ChangeEventHandler<HTMLSelectElement>
    defaultRole?: string
}

const SelectRole = (props: SelectRoleProps) => {
    const { fieldName, isDisabled = false, onChange, defaultRole } = props
    const { organization } = useOrganization()
    const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([])
    const isPopulated = useRef(false)

    useEffect(() => {
        if (isPopulated.current) return
        organization
            ?.getRoles({
                pageSize: 20,
                initialPage: 1,
            })
            .then((res) => {
                isPopulated.current = true
                setRoles(res.data.map((roles) => roles.key as OrganizationCustomRoleKey))
            })
    }, [organization?.id])

    if (fetchedRoles.length === 0) return null

    return (
        <Select name={fieldName} disabled={isDisabled} onValueChange={onChange} defaultValue={defaultRole}>
            <SelectTrigger>
                <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
                {fetchedRoles?.map((roleKey) => (
                    <SelectItem key={roleKey} value={roleKey}>
                        {roleKey}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

// List of pending invitations to an organization.
export const InvitationList = () => {
    const { isLoaded, invitations, memberships } = useOrganization({
        ...OrgInvitationsParams,
        ...OrgMembersParams,
    })

    if (!isLoaded) {
        return <>Loading</>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Invited</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invitations?.data?.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell>{inv.emailAddress}</TableCell>
                                    <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell>{inv.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            onClick={async () => {
                                                await inv.revoke()
                                                await Promise.all([memberships?.revalidate, invitations?.revalidate])
                                            }}
                                        >
                                            Revoke
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!invitations?.hasPreviousPage || invitations?.isFetching}
                        onClick={() => invitations?.fetchPrevious?.()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!invitations?.hasNextPage || invitations?.isFetching}
                        onClick={() => invitations?.fetchNext?.()}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}