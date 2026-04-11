"use client";

import { BatchSelection } from "@/types/common/selection.types";

interface HeaderProps {
  selectedBatch: BatchSelection;
}

export default function Header({ selectedBatch }: HeaderProps) {
  return (
    <div className="flex items-center justify-between glass  mb-5 p-5 -mt-3 backdrop-blur-2xl rounded-2xl ">
      <div>
        <h2 className="text-3xl font-bold">
          {selectedBatch.name} <span className="text-primary" >Dashboard</span>
        </h2>
        <p className="text-muted-foreground mt-1 p-0 m-0">
          Premium analytics overview
        </p>
      </div>
    </div>
  );
}
