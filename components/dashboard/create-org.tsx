"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { FormEventHandler, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { InviteMember } from "./invite-user";

export default function CreateOrganization() {
  const { createOrganization, userMemberships } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [hasOrganization, setHasOrganization] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userMemberships?.data) {
      setHasOrganization(userMemberships.data.length > 0);
    }
  }, [userMemberships?.data]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (hasOrganization) return;
    setIsLoading(true);
    try {
      await createOrganization!({ name: organizationName });
      setShowInvite(true);
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowInvite(false);
    setOrganizationName("");
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="my-4 ml-2"
          disabled={hasOrganization}
          title={
            hasOrganization
              ? "You can only create one organization"
              : "Create Organization"
          }
        >
          <PlusIcon className="w-4 h-4" />
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showInvite ? "Invite Members" : "Create Organization"}
          </DialogTitle>
          <DialogDescription>
            {showInvite
              ? "Invite members to your new organization."
              : "Enter a name for your new organization."}
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
                disabled={hasOrganization}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !organizationName || hasOrganization}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <InviteMember open={isOpen} setOpen={setIsOpen} />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
