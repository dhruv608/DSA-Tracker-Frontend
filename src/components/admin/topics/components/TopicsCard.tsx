"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TopicCardProps } from "@/types/admin/topic";
import { ArrowRight, BookOpen, Calendar, FileQuestion, FolderEdit, ImageIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function TopicCard({
  topic,
  onEdit,
  onDelete,
}: TopicCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button")) {
          router.push(`/admin/topics/${topic.slug}`);
        }
      }}
      className="group glass card-premium hover-glow rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
    >

      {/* IMAGE */}
      <div className="aspect-video relative overflow-hidden">

        {topic.photo_url ? (
          <img
            src={topic.photo_url}
            alt={topic.topic_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

        {/* ACTION BUTTONS */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(topic);
            }}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur border-border hover:bg-primary/10"
          >
            <FolderEdit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(topic);
            }}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur border-border text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* TITLE OVER IMAGE */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {topic.topic_name}
          </h3>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-4">

        {/* STATS */}
        <div className="flex flex-wrap gap-3 text-xs">

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>{topic.classCount || 0} Classes</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40">
            <FileQuestion className="w-3.5 h-3.5 text-primary" />
            <span>{topic.questionCount || 0} Questions</span>
          </div>

        </div>

        {/* DATE */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {topic.firstClassCreated_at
              ? new Date(topic.firstClassCreated_at)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")
              : "No Classes Yet"}
          </span>
        </div>

        {/* CTA */}
        <Button
          variant="secondary"
          className="w-full h-10 rounded-xl font-medium flex items-center justify-center gap-2 group-hover:bg-primary/10 group-hover:text-primary transition-all"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/topics/${topic.slug}`);
          }}
        >
          View Classes
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>

      </div>
    </div>
  );
}