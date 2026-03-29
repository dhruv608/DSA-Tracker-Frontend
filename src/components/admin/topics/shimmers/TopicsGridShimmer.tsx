
export default function TopicsGridShimmer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card border border-border/60 rounded-xl h-[320px]" />
      ))}
    </div>
  );
}   
