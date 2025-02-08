"use client"

import { SideMenu } from "@/components/sidemenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatRelativeTime } from "@/utils/formatRelativeTime"
import { getSnapshotId } from "@/utils/parseSnapshot"
import { FileIcon, RefreshCcw, Tag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface TimelineProps {
  id: string
  owner: string
  ownerGithubId: string
  fileName: string
  version: number
  registeredAt: string
  tags: string[]
}

export default function Timeline() {
  const [timelines, setTimelines] = useState<TimelineProps[]>([])

  const fetchTimelines = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeline`)
      const data = await response.json()
      setTimelines(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTimelines()
  }, [])

  return (
    <div className="flex">
      <SideMenu
        enabledFeatures={new Set(["home", "files", "timeline", "document"])}
      />
      <div className="flex-1 p-4 md:p-8 overflow-y-scroll max-h-screen max-w-screen-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Timeline</h1>
          <Button onClick={fetchTimelines} variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="space-y-6">
          {timelines.map((timeline) => (
            <Card
              key={timeline.id}
              className="p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://avatars.githubusercontent.com/u/${timeline.ownerGithubId}?v=4`}
                    alt={timeline.owner}
                  />
                  <AvatarFallback>
                    <FileIcon className="h-5 w-5 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{timeline.owner}</span>
                    {" registered "}
                    <Link
                      href={`/view?id=${getSnapshotId(timeline.owner, timeline.fileName, timeline.version)}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {timeline.fileName}@{timeline.version}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatRelativeTime(timeline.registeredAt)}
                  </p>
                  {timeline.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {timeline.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

