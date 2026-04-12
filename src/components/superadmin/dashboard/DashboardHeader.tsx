"use client";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between glass  mb-5 p-5 -mt-9 backdrop-blur-2xl rounded-2xl ">
      <div>
        <h2 className="text-3xl font-bold">
          Institutional  <span className="text-primary" >Analytics</span>
        </h2>
        <p className="text-muted-foreground mt-1 p-0 m-0">
          Oversee and manage cities, batches, and administrators across the platform.
        </p>
      </div>
    </div>
  );
}
