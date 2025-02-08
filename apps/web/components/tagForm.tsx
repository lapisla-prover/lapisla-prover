"use client";

import { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagFormProps {
  onChange: (tags: string[]) => void;
}

export default function TagForm({ onChange }: TagFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(() => {
    onChange(tags);
  }, [tags]);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <h2 className="mb-4">Add tags! (optional)</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="input new tag"
          aria-label="input new tag"
        />
        <Button onClick={handleAddTag} aria-label="add tag">
          Add
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="タグリスト">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-auto"
              onClick={() => handleRemoveTag(tag)}
              aria-label={`delete ${tag}`}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
