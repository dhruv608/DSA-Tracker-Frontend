"use client";
import React from 'react';
import { Trophy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from '@/components/Pagination';
import TableShimmer from '@/components/leaderboard/shimmers/TableShimmer';
import { LeaderboardTableRow } from './LeaderboardTableRow';

export function LeaderboardTable({
  data, loading, error,
  page, limit, setPage, setLimit,
  selectedCity,
  mode = 'admin'
}: any) {
  const leaderboard = data?.leaderboard || [];
  const totalRecords = data?.total || 0;
  const errorMsg = error;
  
  // Determine rank column name based on city selection
  const isGlobalView = selectedCity === 'all';
  const rankColumnName = isGlobalView ? 'Global Rank' : 'City Rank';
  
    return (
    <>
      {loading ? (
        <div className="w-full flex-1 p-0">
          <TableShimmer />
        </div>
      ) : (
        <div className=" flex-1 p-0  overflow-auto rounded-2xl">
          <Table className="no-scrollbar">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-border/80">
                <TableHead className="font-bold px-4">Student</TableHead>
                <TableHead className=" text-center font-bold">{rankColumnName}</TableHead>
                <TableHead className="font-bold">Location</TableHead>
                <TableHead className="font-bold text-center">Score</TableHead>
                <TableHead className="font-bold text-center">Max Streak</TableHead>
                <TableHead className="font-bold text-center">Solved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorMsg ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[300px] text-center text-red-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="font-bold">Error Fetching Data</p>
                      <p className="text-sm opacity-80 mt-1">{errorMsg}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[300px] text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center opacity-70">
                      <Trophy className="w-12 h-12 mb-4 text-muted-foreground/50" />
                      <p>No students found for the current filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((entry: any) => (
                  <LeaderboardTableRow key={entry.student_id || entry.username} entry={entry}  selectedCity={selectedCity} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {mode !== 'student' && (
        <Pagination
          currentPage={page}
          totalItems={totalRecords}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit: number) => {
            setLimit(newLimit);
            setPage(1);
          }}
          showLimitSelector={true}
          loading={false}
        />
      )}
    </>
  );
}
