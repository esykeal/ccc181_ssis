import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ProgramSearchBarProps {
  onSearch: (query: string) => void;
}

export default function ProgramSearchBar({ onSearch }: ProgramSearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // Only trigger the search in the Parent when button is clicked
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch(""); // Reset the list to show all
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search by code, name, or college..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button onClick={handleSearch} variant="secondary">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
