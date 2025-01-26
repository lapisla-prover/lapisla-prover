"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, RefreshCcw, Tag, TagIcon } from "lucide-react";
import { use, useEffect, useState } from "react";

interface TimelineProps {
  id: string;
  owner: string;
  ownerGithubId: string;
  fileName: string;
  version: number;
  registeredAt: string;
  tags: string[];
}

export default function Timeline() {
  const [timelines, setTimelines] = useState<TimelineProps[]>([
    {
      id: "id",
      owner: "owner",
      ownerGithubId: "61650874",
      fileName: "fileName",
      version: 0,
      registeredAt: "registeredAt",
      tags: ["tags", "aho"],
    },
    {
      id: "id2",
      owner: "owner",
      ownerGithubId: "53076594",
      fileName: "fileName",
      version: 1,
      registeredAt: "registeredAt",
      tags: ["tags"],
    },
  ]);
  const fetchTimelines = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/timeline`
      );
      const data = await response.json();
      setTimelines(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTimelines();
  }, []);

  return (
    <div className="p-8 gap-8">
      <div className="w-[60%] p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">Timeline</div>
        </div>
        <div className="h-0.5 w-full bg-black" />
        <div className="flex justify-end">
          <Button onClick={() => fetchTimelines()}>
            <RefreshCcw />
          </Button>
        </div>
        {timelines.map((timeline) => (
          <Card key={timeline.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://avatars.githubusercontent.com/u/${timeline.ownerGithubId}?v=4`}
                  alt={timeline.owner}
                />
                <AvatarFallback>
                  <Tag className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-2xl">
                <span className="font-bold text-3xl">{timeline.owner}</span>{" "}
                register{" "}
                <span className="font-bold text-3xl">{timeline.fileName}</span>
                /@{timeline.version} !!!
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 pl-11">
              {timeline.tags.map((tag) => (
                <Card key={tag} className="flex items-center gap-1 p-2">
                  <TagIcon className="" />
                  {tag}
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
