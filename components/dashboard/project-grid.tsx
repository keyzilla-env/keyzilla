import Link from 'next/link';
import { Protect, useOrganization, useUser } from '@clerk/nextjs';
import { Organization } from '@clerk/nextjs/server';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Doc } from '@/convex/_generated/dataModel';
import AddProjectForm from './add-project-form';
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';
import { Key } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ProjectGridProps {
    projects: Doc<'projects'>[] | undefined;
    searchTerm: string;
}
export default function ProjectGrid({ projects, searchTerm }: ProjectGridProps) {
    const { user } = useUser();
    const filteredProjects = projects?.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 p-4">
            {filteredProjects?.map((project: Doc<'projects'>) => (
                <ProjectCard key={project._id} project={project} />
            ))}
        </div>
    );
}

interface ProjectCardProps {
    project: Doc<'projects'>;
}
function ProjectCard({ project }: ProjectCardProps) {
    const { organization } = useOrganization();

    const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
    if (!project) {
        return (
            <Protect
                condition={(has) => !has({ permission: "org:sys_memberships:read" }) || !organization}
                fallback={<></>}
            >
                <div className="flex items-center justify-center gap-4">
                    <Button onClick={() => setIsAddProjectDialogOpen(true)}>
                        Add Project
                    </Button>
                    <AddProjectForm
                        isOpen={isAddProjectDialogOpen}
                        onClose={() => setIsAddProjectDialogOpen(false)}
                    />
                </div>
            </Protect>
        );
    }
    return (
        <div className={cn(
            "bg-white dark:bg-black p-6 rounded-lg shadow-md",
            "hover:border-2 hover:border-purple-500 dark:text-white",
            "hover:shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300",
            "flex flex-col justify-between h-full"
        )}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <AvatarImage src={project.userProfile as string} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {project.userName}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <AvatarFallback>
                                {project.userProfile?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <Link href={`/dashboard/${project.name}`}>
                            <h2 className="text-xl font-semibold hover:underline">{project.name}</h2>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600">
                        <span>{project.apiKeys.length}</span>
                        <Key className="w-4 h-4" />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    {project.description}
                </p>
            </div>
            <div className="text-xs text-muted-foreground mt-4">
                Created {formatDistanceToNow(new Date(project._creationTime), { addSuffix: true })}
            </div>
        </div>
    );
}