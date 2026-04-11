"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Download, FileText, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import { BruteForceLoader } from '@/components/ui/BruteForceLoader';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Select } from "@/components/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getAllCities } from '@/services/city.service';
import { getAllBatches } from '@/services/batch.service';
import { City } from '@/types/superadmin/city.types';
import { Batch } from '@/types/superadmin/batch.types';
import { DeleteModal } from '@/components/DeleteModal';
import { showSuccess } from '@/ui/toast';
import { apiClient } from '@/api';

interface DownloadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DownloadReportModal({
  open,
  onOpenChange,
}: DownloadReportModalProps) {

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [loading, setLoading] = useState(false);

  // Data states
  const [cities, setCities] = useState<City[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Fetch cities and batches on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesData, batchesData] = await Promise.all([
          getAllCities(),
          getAllBatches()
        ]);
        setCities(citiesData);
        setBatches(batchesData);
      } catch (error) {
        // Error is handled by API client interceptor
        console.error('Failed to fetch data:', error);
      }
    };
    if (open) fetchData();
  }, [open]);

  // Reset selections when city changes
  const handleCityChange = useCallback((value: string | number) => {
    const cityId = value.toString();
    setSelectedCity(cityId);
    setSelectedYear('');
    setSelectedBatch('');
  }, []);

  // Reset batch when year changes
  const handleYearChange = useCallback((value: string | number) => {
    const year = value.toString();
    setSelectedYear(year);
    setSelectedBatch('');
  }, []);

  // Get unique years for selected city
  const getYearsForCity = useCallback(() => {
    if (!selectedCity) return [];
    const cityBatches = batches.filter((b: Batch) => b.city_id === Number(selectedCity));
    const years = [...new Set(cityBatches.map((b: Batch) => b.year))];
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  }, [selectedCity, batches]);

  // Get batches for selected city and year
  const getBatchesForCityYear = useCallback(() => {
    if (!selectedCity || !selectedYear) return [];
    return batches.filter((b: Batch) => 
      b.city_id === Number(selectedCity) && b.year === Number(selectedYear)
    );
  }, [selectedCity, selectedYear, batches]);

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
      // Reset form
      setSelectedCity('');
      setSelectedYear('');
      setSelectedBatch('');
      setSelectedFormat('csv');
    }
  };

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!selectedBatch) return;

    setLoading(true);

    try {
      // Call the download API
      const response = await apiClient.post('/api/admin/student/reportdownload', {
        batch_id: Number(selectedBatch)
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || 'Failed to download report');
      }

      // Create blob and trigger download
      const blob = new Blob([result.csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Show success toast
      showSuccess('Report downloaded successfully!');
      
      // Close modal
      handleClose();
      
    } catch (error) {
      console.error('Download error:', error);
      
      // Extract error message
      const errorMessage = (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.message || 
                          (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.error || 
                          (error as { message?: string })?.message || 
                          'Download failed. Please try again.';
      
      // Error is handled by API client interceptor - keep console log for debugging
      console.error('Download error:', errorMessage);
      
    } finally {
      setLoading(false);
    }
  }, [selectedBatch, handleClose]);

  // Check if download should be disabled
  const isDownloadDisabled = !selectedCity || !selectedYear || !selectedBatch || !selectedFormat || loading;

 return (
  <Dialog open={open} onOpenChange={handleClose}>
    <DialogContent className="w-[95vw] max-w-[520px] p-0 overflow-hidden flex flex-col rounded-2xl">

      {/* HEADER */}
      <DialogHeader className="px-6 py-5 border-b border-border/40">
        <DialogTitle className="text-lg font-semibold flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Download className="w-4 h-4 text-primary" />
          </div>
          Download Student Report
        </DialogTitle>

        <DialogDescription className="text-xs text-muted-foreground">
          Generate and download student reports for any batch in CSV format.
        </DialogDescription>
      </DialogHeader>

      {/* BODY */}
      <div className="p-6 space-y-6">

        {/* LOCATION */}
        <div className="space-y-5 p-5 rounded-2xl border border-border/40 bg-muted/20">

          <p className="text-xs font-semibold text-muted-foreground">
            Batch Selection
          </p>

          {/* CITY */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              City <span className="text-destructive">*</span>
            </Label>

            <Select
              value={selectedCity}
              onChange={handleCityChange}
              options={[
                { label: 'Select city...', value: '' },
                ...cities.map((city: City) => ({
                  label: city.city_name,
                  value: city.id.toString()
                }))
              ]}
              className="h-11"
            />
          </div>

          {/* YEAR */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Year <span className="text-destructive">*</span>
            </Label>

            <Select
              value={selectedYear}
              onChange={handleYearChange}
              options={[
                { label: 'Select year...', value: '' },
                ...getYearsForCity().map((year: number) => ({
                  label: year.toString(),
                  value: year.toString()
                }))
              ]}
              className="h-11"
              disabled={!selectedCity}
            />
          </div>

          {/* BATCH */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Batch <span className="text-destructive">*</span>
            </Label>

            <Select
              value={selectedBatch}
              onChange={(value: string | number) =>
                setSelectedBatch(value.toString())
              }
              options={[
                { label: 'Select batch...', value: '' },
                ...getBatchesForCityYear().map((batch: Batch) => ({
                  label: batch.batch_name,
                  value: batch.id.toString()
                }))
              ]}
              className="h-11"
              disabled={!selectedYear}
            />
          </div>

        </div>

        
      </div>

      {/* FOOTER */}
      <DialogFooter className="px-6 py-4 border-t border-border/40 flex gap-3">

        <Button
          variant="ghost"
          onClick={handleClose}
          disabled={loading}
          className="h-11"
        >
          Cancel
        </Button>

        <Button
          disabled={isDownloadDisabled}
          onClick={handleDownload}
          className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
        >
          {loading ? (
            <>
              <BruteForceLoader size="sm" className="mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </>
          )}
        </Button>

      </DialogFooter>

    </DialogContent>
  </Dialog>
);
}
