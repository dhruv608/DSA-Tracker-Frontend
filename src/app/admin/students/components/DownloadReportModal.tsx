"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Download, FileText, AlertCircle, CheckCircle2, Database } from 'lucide-react';
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
import { getAllCities, City } from '@/services/city.service';
import { getAllBatches, Batch } from '@/services/batch.service';
import { toastEvent } from '@/app/(auth)/shared/hooks/useToast';
import api from '@/lib/api';

export default function DownloadReportModal({
  open,
  onOpenChange,
}: any) {

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [loading, setLoading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

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
    const cityBatches = batches.filter((b: any) => b.city_id === Number(selectedCity));
    const years = [...new Set(cityBatches.map((b: any) => b.year))];
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  }, [selectedCity, batches]);

  // Get batches for selected city and year
  const getBatchesForCityYear = useCallback(() => {
    if (!selectedCity || !selectedYear) return [];
    return batches.filter((b: any) => 
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
      setDownloadError('');
    }
  };

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!selectedBatch) return;

    setLoading(true);
    setDownloadError('');

    try {
      // Call the download API using axios
      const response = await api.post('/api/admin/student/reportdownload', {
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
      toastEvent('Report downloaded successfully!', 'success');
      
      // Close modal
      handleClose();
      
    } catch (error: any) {
      console.error('Download error:', error);
      
      // Extract error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Download failed. Please try again.';
      
      setDownloadError(errorMessage);
      
      // Show error toast
      toastEvent(errorMessage, 'error');
      
    } finally {
      setLoading(false);
    }
  }, [selectedBatch, handleClose]);

  // Check if download should be disabled
  const isDownloadDisabled = !selectedCity || !selectedYear || !selectedBatch || !selectedFormat || loading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] p-0 overflow-hidden flex flex-col rounded-2xl">

        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b bg-muted/40">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Download Student Report
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Generate and download student reports for any batch in CSV format.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* LOCATION SELECTION */}
          <div className="space-y-4 p-4 rounded-xl border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground">
              Select Batch Location
            </p>

            {/* City Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCity}
                onChange={handleCityChange}
                options={[
                  { label: 'Select city...', value: '' },
                  ...cities.map((city: any) => ({
                    label: city.city_name,
                    value: city.id.toString()
                  }))
                ]}
                className="h-11"
              />
            </div>

            {/* Year Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Year <span className="text-red-500">*</span>
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

            {/* Batch Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Batch <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedBatch}
                onChange={(value: string | number) => setSelectedBatch(value.toString())}
                options={[
                  { label: 'Select batch...', value: '' },
                  ...getBatchesForCityYear().map((batch: any) => ({
                    label: batch.batch_name,
                    value: batch.id.toString()
                  }))
                ]}
                className="h-11"
                disabled={!selectedYear}
              />
            </div>
          </div>



          {/* STATUS MESSAGES */}
          {downloadError && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertCircle className="w-4 h-4" />
              {downloadError}
            </div>
          )}

          {selectedBatch && !downloadError && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              Ready to download report for selected batch 
            </div>
          )}

        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t flex gap-3">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            disabled={isDownloadDisabled}
            onClick={handleDownload}
            className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-primary to-amber-600"
          >
            {loading ? (
              <>
                <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Generating Report...
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
