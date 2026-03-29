import TopicsGridShimmer from "./TopicsGridShimmer";



export default function TopicsPageShimmer() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-muted rounded-md"></div>
                    <div className="h-4 w-96 bg-muted/60 rounded-md"></div>
                </div>
                <div className="h-10 w-32 bg-muted rounded-md"></div>
            </div>

            <div className="h-16 w-full bg-card border border-border rounded-xl"></div>

            <TopicsGridShimmer />
        </div>
    );
}
