import { Button } from "@/components/ui/button";
import { Database, ExternalLink, Plus, Search, Settings2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DatabaseConfig } from "@/components/DatabaseConfig";

const dbtype_images = {
    "chroma": "/logos/chroma.webp",
    "faiss": "/logos/meta.png",
    "pinecone": "/logos/pinecone.png",
    "pgvector": "/logos/pg-vector.png",
    "qdrant": "/logos/qdrant.png",
    "weaviate": "/logos/weaviate.png",
    "milvus": "/logos/milvus.png",
} as const;

interface VectorDatabase {
    name: string;
    type: keyof typeof dbtype_images;
    description: string;
    documentCount: number;
    lastUpdated: string;
    status: "active" | "indexing" | "error";
}

const sample_databases: VectorDatabase[] = [
    {
        name: "Website Index",
        type: "chroma",
        description:
            "Semantic search index for website content and documentation",
        documentCount: 15234,
        lastUpdated: "2024-03-15",
        status: "active",
    },
    {
        name: "Product Index",
        type: "chroma",
        description: "Product catalog with semantic search capabilities",
        documentCount: 8756,
        lastUpdated: "2024-03-14",
        status: "indexing",
    },
    {
        name: "Customer Support",
        type: "pinecone",
        description: "Support tickets and knowledge base articles",
        documentCount: 25689,
        lastUpdated: "2024-03-13",
        status: "active",
    },
    {
        name: "Scientific Research",
        type: "pgvector",
        description: "Research papers and academic publications",
        documentCount: 42156,
        lastUpdated: "2024-03-12",
        status: "active",
    },
    {
        name: "Financial Data",
        type: "qdrant",
        description: "Financial reports and market analysis",
        documentCount: 12567,
        lastUpdated: "2024-03-10",
        status: "error",
    },
];

const DatabaseList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDb, setSelectedDb] = useState<string | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const filteredDatabases = sample_databases.filter((db) =>
        db.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        db.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: VectorDatabase["status"]) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 border-green-200";
            case "indexing":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "error":
                return "bg-red-100 text-red-700 border-red-200";
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 border-b flex items-center justify-between bg-gray-50/50">
                <h3 className="text-sm font-medium text-gray-700">
                    Vector Databases
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-gray-100"
                    onClick={() => setAddDialogOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search databases..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <DatabaseConfig
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
            />

            <div className="flex-1 overflow-auto">
                {filteredDatabases.map((db) => (
                    <div
                        key={db.name}
                        className={`
                            group px-3 py-2 hover:bg-gray-50 cursor-pointer border-l-2 border-b
                            ${
                            selectedDb === db.name
                                ? "border-l-blue-500 bg-blue-50/50"
                                : "border-l-transparent"
                        }
                        `}
                        onClick={() => setSelectedDb(db.name)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <Image
                                    src={dbtype_images[db.type]}
                                    alt={db.type}
                                    className="w-5 h-5 object-contain rounded-sm"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="truncate">
                                        <span className="font-medium text-sm">
                                            {db.name}
                                        </span>
                                        <span className="mx-2 text-gray-400">
                                            ·
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatNumber(db.documentCount)}
                                            {" "}
                                            docs
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                >
                                                    <Settings2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Configure database
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Open in dashboard
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Badge
                                        variant="outline"
                                        className={`${
                                            getStatusColor(db.status)
                                        } px-1.5 py-0 h-4 text-[10px] font-normal`}
                                    >
                                        {db.status.charAt(0).toUpperCase() +
                                            db.status.slice(1)}
                                    </Badge>
                                    <span className="truncate text-xs text-gray-500">
                                        {db.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DatabaseList;
