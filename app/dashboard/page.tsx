"use client"

import { useEffect, useState } from 'react';
import AddProjectForm from "@/components/dashboard/add-project-form";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProjectGrid from "@/components/dashboard/project-grid";
import ProjectSearch from "@/components/dashboard/project-search";
import { Skeleton } from "@/components/ui/skeleton";
import { OrganizationSwitcher, useOrganization, UserButton } from '@clerk/nextjs';
import { Protect } from '@clerk/clerk-react';

export default function DashboardPage() {
    const { organization } = useOrganization();

    const projects = useQuery(api.projects.getProjects, { organizationId: organization?.id || "" });
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">{organization?.name || "dashboard"}</h1>
            <div className="flex items-center justify-between space-x-4">
                <div className="flex-grow">
                    <ProjectSearch onSearch={handleSearch} disabled={!projects} />
                </div>
                <Protect
                    condition={(has) => has({ permission: "org:sys_memberships:manage" }) || !organization}
                    fallback={<></>}
                >
                    <Button onClick={() => setIsAddProjectDialogOpen(true)}>Add Project</Button>

                    <AddProjectForm
                        isOpen={isAddProjectDialogOpen}
                        onClose={() => setIsAddProjectDialogOpen(false)}
                    />
                </Protect>
            </div>
            <div className="mt-6">
                {projects === undefined ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <Skeleton key={index} className="h-14 w-full" />
                        ))}
                    </div>
                ) : projects.length > 0 ? (
                    <ProjectGrid projects={projects} searchTerm={searchTerm} />
                ) : (
                    <Protect
                        condition={(has) => has({ permission: "org:sys_memberships:manage" }) || !organization}
                        fallback={<Fallback />}
                    >
                        <div className="flex flex-col items-center justify-center gap-4 text-center mt-12">
                            <p>Add your first project to get started</p>
                            <Button onClick={() => setIsAddProjectDialogOpen(true)}>Add Project</Button>

                            <AddProjectForm
                                isOpen={isAddProjectDialogOpen}
                                onClose={() => setIsAddProjectDialogOpen(false)}
                            />
                        </div>
                    </Protect>
                )}
            </div>
        </div>
    );
}
function Fallback() {
    return (
        <div className="text-center">
            Your organization does not have any projects yet.
        </div>
    );
}
