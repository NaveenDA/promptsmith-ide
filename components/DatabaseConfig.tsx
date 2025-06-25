import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Database, Plus, Trash2, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import Image from "next/image";

interface VectorDB {
  id: string;
  name: string;
  type: "pinecone" | "qdrant" | "weaviate" | "milvus" | "cassandra" | "clickhouse" | "mongodb" | "redis";
  icon: string;
  connectionString: string;
  indexName: string;
  status: "connected" | "disconnected" | "error";
  documentCount?: number;
}

const DATABASE_OPTIONS: Omit<VectorDB, "id" | "status" | "connectionString" | "indexName" | "documentCount">[] = [
  { name: "Apache Cassandra", type: "cassandra", icon: "/db-icons/cassandra.svg" },
  { name: "ClickHouse", type: "clickhouse", icon: "/db-icons/clickhouse.svg" },
  { name: "MongoDB", type: "mongodb", icon: "/db-icons/mongodb.svg" },
  { name: "Redis", type: "redis", icon: "/db-icons/redis.svg" },
  { name: "Pinecone", type: "pinecone", icon: "/db-icons/pinecone.svg" },
  { name: "Qdrant", type: "qdrant", icon: "/db-icons/qdrant.svg" },
  { name: "Weaviate", type: "weaviate", icon: "/db-icons/weaviate.svg" },
  { name: "Milvus", type: "milvus", icon: "/db-icons/milvus.svg" },
];

export function DatabaseConfig() {
  const [databases, setDatabases] = useState<VectorDB[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDB, setSelectedDB] = useState<VectorDB | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAddDatabase = (db: Omit<VectorDB, "id" | "status">) => {
    setDatabases([
      ...databases,
      {
        ...db,
        id: Math.random().toString(36).substr(2, 9),
        status: "disconnected",
      },
    ]);
    setDialogOpen(false);
  };

  const handleTestConnection = async (db: VectorDB) => {
    // TODO: Implement actual connection test
    setDatabases(
      databases.map((d) =>
        d.id === db.id
          ? { ...d, status: "connected", documentCount: 1234 }
          : d
      )
    );
  };

  const handleSearch = async (query: string) => {
    // TODO: Implement actual vector search
    setSearchResults([
      {
        text: "Sample document matching the query",
        similarity: 0.92,
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Vector Databases</h2>
          <Badge variant="outline" className="text-xs">
            {databases.length} connected
          </Badge>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => setDialogOpen(true)}
        >
          Add Database
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Connected Databases */}
        {databases.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4">Connected Databases</h3>
            <div className="space-y-4">
              {databases.map((db) => (
                <div
                  key={db.id}
                  className="group rounded-lg border p-4 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 relative">
                        <Image
                          src={db.icon}
                          alt={db.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">{db.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          db.status === "connected"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : db.status === "error"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        )}
                      >
                        {db.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleTestConnection(db)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedDB(db);
                          setSearchDialogOpen(true);
                        }}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() =>
                          setDatabases(databases.filter((d) => d.id !== db.id))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Type: {db.type}</div>
                    <div>Index: {db.indexName}</div>
                    {db.documentCount && (
                      <div>Documents: {db.documentCount.toLocaleString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Databases Grid */}
        <div>
          <h3 className="text-sm font-medium mb-4">Available Databases</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {DATABASE_OPTIONS.map((option) => (
              <button
                key={option.type}
                className={cn(
                  "flex flex-col items-center p-4 rounded-lg border hover:border-blue-200 transition-colors",
                  selectedOption === option.type && "border-blue-500 bg-blue-50"
                )}
                onClick={() => {
                  setSelectedOption(option.type);
                  setDialogOpen(true);
                }}
              >
                <div className="h-12 w-12 relative mb-2">
                  <Image
                    src={option.icon}
                    alt={option.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vector Database</DialogTitle>
            <DialogDescription>
              Connect to your vector database to enable semantic search in prompts.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const selectedType = formData.get("type") as VectorDB["type"];
              const option = DATABASE_OPTIONS.find(opt => opt.type === selectedType);
              handleAddDatabase({
                name: formData.get("name") as string,
                type: selectedType,
                icon: option?.icon || "/db-icons/database.svg",
                connectionString: formData.get("connectionString") as string,
                indexName: formData.get("indexName") as string,
              });
            }}
          >
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select name="type" defaultValue={selectedOption || "pinecone"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATABASE_OPTIONS.map(option => (
                      <SelectItem key={option.type} value={option.type}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="connectionString" className="text-right">
                  Connection String
                </Label>
                <Input
                  id="connectionString"
                  name="connectionString"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="indexName" className="text-right">
                  Index Name
                </Label>
                <Input
                  id="indexName"
                  name="indexName"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Database</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Semantic Search</DialogTitle>
            <DialogDescription>
              Search {selectedDB?.name} for relevant content to include in your prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your search query..."
                className="flex-1"
              />
              <Button onClick={() => handleSearch(searchQuery)}>Search</Button>
            </div>
            {searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((result, i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <div className="text-sm">{result.text}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Similarity: {(result.similarity * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 