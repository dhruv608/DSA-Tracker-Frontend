import { Skeleton } from "@/components/ui/skeleton";
import TopicsGridShimmer from "./TopicsGridShimmer";

export default function TopicsPageShimmer() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Filter Bar Skeleton */}
            <div className="glass backdrop-blur-2xl rounded-2xl p-4">
                <Skeleton className="h-16 w-full" />
            </div>

            <TopicsGridShimmer />
        </div>
    );
}
