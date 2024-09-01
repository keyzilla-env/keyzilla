"use client"
import { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Protect, useOrganization } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import {
    Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, Copy, Key, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner"
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import Settings from "@/components/dashboard/project/settings";
import { AddApiKey } from "@/components/dashboard/add-api-key";
import { useSearchParams } from "next/navigation";
import { UsageChart } from "@/components/dashboard/project/usage-chart";

export const dynamic = 'force-dynamic'

export default function ProjectPage({ params }: { params: { name: string } }) {
    const { organization } = useOrganization();
    const [projectId, setProjectId] = useState<Id<"projects"> | null>(null);
    const [isAddApiKeyDialogOpen, setIsAddApiKeyDialogOpen] = useState(false);
    const searchParams = useSearchParams();

    const project = useQuery(api.projects.getProjectByName, {
        name: decodeURIComponent(params.name),
        organizationId: organization?.id || ""
    });



    useEffect(() => {
        if (project) {
            setProjectId(project._id);
        }
    }, [project]);

    useEffect(() => {
        if (searchParams.get('addApiKey') === 'true') {
            setIsAddApiKeyDialogOpen(true);
        }
    }, [searchParams]);

    const apiKeys = useQuery(api.apiKeys.getApiKeys,
        projectId ? { projectId } : "skip"
    );

    const [newApiKey, setNewApiKey] = useState("");
    const createApiKey = useMutation(api.apiKeys.createApiKey);
    const deleteApiKey = useMutation(api.apiKeys.deleteApiKey);

    if (project === undefined) {
        return <ProjectSkeleton />;
    }

    if (project === null) {
        return <div>Project not found</div>;
    }

    const handleCreateApiKey = async () => {
        try {
            await createApiKey({ projectId: project._id, value: newApiKey });
            setNewApiKey("");
            toast.success("API Key created successfully");
        } catch (error) {
            toast.error("Failed to create API Key");
        }
    };

    const handleDeleteApiKey = async (apiKeyId: Id<"apiKeys">) => {
        try {
            await deleteApiKey({ apiKeyId });
            toast.success("APIKey deleted successfully");
        } catch (error) {
            toast.error("Failed to delete API Key");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };
    console.log(project)
    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
                    <p className="text-lg opacity-80">{project.description}</p>

                </CardHeader>
            </Card>

            <Tabs defaultValue="api-keys" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>


                    {organization ? (
                        <Protect
                            role="org:admin"
                            fallback={
                                <TabsTrigger value="settings" disabled>
                                    Settings (admins only)
                                </TabsTrigger>
                            }
                        >
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </Protect>
                    ) : (
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    )}
                </TabsList>
                <TabsContent value="api-keys" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold flex items-center justify-between">
                                <div className="flex items-center">
                                    <Code className="mr-2" /> API Keys
                                </div>
                                {organization ? (
                                    <Protect
                                        role="org:admin"
                                        fallback={
                                            <>

                                            </>
                                        }
                                    >
                                        <AddApiKey
                                            projectId={project._id}
                                            isOpen={isAddApiKeyDialogOpen}
                                            onOpenChange={setIsAddApiKeyDialogOpen}
                                        >
                                            <Button>
                                                Add API key
                                            </Button>
                                        </AddApiKey>
                                    </Protect>
                                ) : (
                                    <AddApiKey
                                        projectId={project._id}
                                        isOpen={isAddApiKeyDialogOpen}
                                        onOpenChange={setIsAddApiKeyDialogOpen}
                                    >
                                        <Button>
                                            Add API key
                                        </Button>
                                    </AddApiKey>
                                )}
                            </CardTitle>


                        </CardHeader>
                        <CardContent>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>API Key</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead> Key Type </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {apiKeys?.map((apiKey) => (
                                        <TableRow key={apiKey._id}>
                                            <TableCell className="font-mono">
                                                {apiKey.apiKey.slice(0, 8)}...{apiKey.apiKey.slice(-8)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {new Date(apiKey.createdAt).toLocaleString()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {apiKey.isServer ? <Badge variant="outline">Server</Badge> : <Badge variant="outline">Client</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(apiKey.apiKey)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Protect
                                                        role="org:admin"
                                                        fallback={
                                                            <>

                                                            </>
                                                        }
                                                    >
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteApiKey(apiKey._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Protect>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="usage">
                    <Card>
                        <CardHeader>
                            <CardTitle>Usage Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UsageChart />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings">
                    <Settings project={project} />
                </TabsContent>
                <TabsContent value="logs">

                </TabsContent>
            </Tabs>
        </div>
    );
}

function ProjectSkeleton() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <Skeleton className="h-40 w-full" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
}
