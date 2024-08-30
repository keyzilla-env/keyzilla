"use client"
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import {
    Card, CardHeader, CardTitle, CardContent, CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Key, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Activity, TrendingUp } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"


import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react";


export default function ProjectPage({ params }: { params: { name: string } }) {
    const { organization } = useOrganization();
    const project = useQuery(api.projects.getProjectById, {
        name: params.name,
        organizationId: organization?.id ?? ""
    });
    const apiKeys = useQuery(api.apiKeys.getApiKeys, {
        projectId: project?._id ?? ""
    });
    const [newApiKey, setNewApiKey] = useState("");
    const createApiKey = useMutation(api.apiKeys.createApiKey);
    const deleteApiKey = useMutation(api.apiKeys.deleteApiKey);

    if (!project) {
        return <ProjectSkeleton />;
    }

    const handleCreateApiKey = async () => {
        try {
            await createApiKey({ projectId: project._id });
            setNewApiKey("");
            toast.success("API Key created successfully");
        } catch (error) {
            toast.error("Failed to create API Key");
        }
    };

    const handleDeleteApiKey = async (apiKeyId: string) => {
        try {
            await deleteApiKey({ apiKeyId });
            toast.success("API Key deleted successfully");
        } catch (error) {
            toast.error("Failed to delete API Key");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
                    <p className="text-lg opacity-80">{project.description}</p>
                </CardHeader>
            </Card>

            <Tabs defaultValue="api-keys" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                <TabsContent value="api-keys" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold flex items-center">
                                <Key className="mr-2" /> API Keys
                            </CardTitle>


                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2 mb-4">
                                <Input
                                    placeholder="Enter new API key"
                                    value={newApiKey}
                                    onChange={(e) => setNewApiKey(e.target.value)}
                                />
                                <Button onClick={handleCreateApiKey}>
                                    <Plus className="mr-2 h-4 w-4" /> Create
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>API Key</TableHead>
                                        <TableHead>Created At</TableHead>
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
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(apiKey.apiKey)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteApiKey(apiKey._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                        </CardContent>
                    </Card>
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
