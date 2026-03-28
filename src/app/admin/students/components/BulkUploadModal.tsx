"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { bulkUploadStudents } from '@/services/admin.service';
import { showSuccess, handleError } from '@/utils/handleError';

export default function BulkUploadModal({
  open,
  onOpenChange,
  onSuccess,
}: any) {

  const [file, setFile] = useState<File | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [showGuide, setShowGuide] = useState(false);

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
        handleError(error);
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
      setFile(null);
      setSelectedCity('');
      setSelectedYear('');
      setSelectedBatch('');
      setValidationError('');
      setUploadError('');
      setCsvData([]);
    }
  };

  // CSV Validation
  const validateCSV = useCallback((data: any[]) => {
    console.log('Starting validation with data:', data);
    
    if (!data || data.length === 0) {
      console.log('Validation failed: Empty data');
      return 'CSV file is empty or invalid';
    }

    const requiredColumns = ['name', 'email', 'enrollment_id'];
    const firstRow = data[0];
    console.log('First row for column check:', firstRow);

    // Check required columns
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    if (missingColumns.length > 0) {
      console.log('Validation failed: Missing columns', missingColumns);
      return `Missing required columns: ${missingColumns.join(', ')}`;
    }

    // Validate each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      console.log(`Validating row ${i + 1}:`, row);
      
      if (!row.name || !row.email || !row.enrollment_id) {
        console.log(`Validation failed: Missing data in row ${i + 1}`, {
          name: !!row.name,
          email: !!row.email,
          enrollment_id: !!row.enrollment_id
        });
        return `Row ${i + 1}: Missing required data (name, email, enrollment_id)`;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        console.log(`Validation failed: Invalid email format in row ${i + 1}`, row.email);
        return `Row ${i + 1}: Invalid email format - ${row.email}`;
      }

      // Domain validation - must contain pwioi.com
      if (!row.email.includes('pwioi.com')) {
        console.log(`Validation failed: Wrong domain in row ${i + 1}`, row.email);
        return `Row ${i + 1}: Email must contain pwioi.com domain - ${row.email}`;
      }
    }

    console.log('Validation successful!');
    return null; // Valid
  }, []);

  // Parse CSV file
  const parseCSV = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        console.log('Raw CSV text:', text);
        
        const lines = text.trim().split('\n');
        console.log('Split lines:', lines);
        
        if (lines.length < 2) {
          setValidationError('CSV must contain at least a header and one data row');
          setCsvData([]);
          return;
        }

        // Parse CSV (simple comma-separated parser)
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        console.log('Parsed headers:', headers);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          console.log(`Row ${i} values:`, values);
          const row: any = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          console.log(`Row ${i} object:`, row);
          data.push(row);
        }

        console.log('Final parsed data:', data);

        // Validate parsed data
        const error = validateCSV(data);
        if (error) {
          console.log('Validation error:', error);
          setValidationError(error);
          setCsvData([]);
        } else {
          console.log('Validation passed!');
          setValidationError('');
          setCsvData(data);
        }
      } catch (error) {
        handleError(error);
        console.error('CSV parsing error:', error);
        setValidationError('Failed to parse CSV file');
        setCsvData([]);
      }
    };

    reader.onerror = () => {
      setValidationError('Failed to read file');
      setCsvData([]);
    };

    reader.readAsText(file);
  }, [validateCSV]);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setValidationError('Please select a CSV file');
        setCsvData([]);
        return;
      }

      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  }, [parseCSV]);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!file || !selectedBatch) return;

    setLoading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('batch_id', selectedBatch);

      console.log('Uploading students...', { fileName: file.name, batchId: selectedBatch });
      
      const result = await bulkUploadStudents(formData);
      
      console.log('Upload result:', result);

      // Show success toast
      const message = result.message || `Successfully uploaded ${result.inserted || 0} students`;
      showSuccess('FILE_UPLOADED', message);

      // Success callback and close modal
      onSuccess?.(result);
      handleClose();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Extract error message
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Upload failed. Please try again.';
      
      setUploadError(errorMessage);
      
      // Show error toast
      handleError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  }, [file, selectedBatch, onSuccess, handleClose]);

  // Check if upload should be disabled
  const isUploadDisabled = !file || !selectedCity || !selectedYear || !selectedBatch || !!validationError || loading;

return (
  <>
    {/* MAIN MODAL */}
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[700px] p-0 overflow-hidden flex flex-col rounded-2xl glass card-premium">

        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border/40">
          <DialogTitle className="text-lg font-semibold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Upload className="w-4 h-4 text-primary" />
            </div>
            Bulk Upload Students
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Upload multiple students using CSV and assign them to a batch.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* LOCATION */}
          <div className="space-y-5 p-5 rounded-2xl border border-border/40 bg-muted/20">

            <p className="text-xs font-semibold text-muted-foreground">
              Batch Assignment
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
                  ...cities.map((city: any) => ({
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

          {/* FILE INPUT */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              CSV File
            </Label>

            <label className="flex items-center justify-between border border-border rounded-xl px-4 py-3 cursor-pointer bg-background/40 hover:border-primary/40 transition">

              <span className="text-sm text-muted-foreground truncate">
                {file ? file.name : "Choose CSV file"}
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold">
                Browse
              </span>

              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {/* GUIDE */}
          <div className="flex justify-between items-center border border-border/40 rounded-xl px-4 py-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Need CSV format help?
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuide(true)}
              className="rounded-lg"
            >
              <FileText className="w-4 h-4 mr-1" />
              View Guide
            </Button>
          </div>

          {/* STATUS */}
          {validationError && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertCircle className="w-4 h-4" />
              {validationError}
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertCircle className="w-4 h-4" />
              {uploadError}
            </div>
          )}

          {csvData.length > 0 && !validationError && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              {csvData.length} students ready 🚀
            </div>
          )}

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
            disabled={isUploadDisabled}
            onClick={handleUpload}
            className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
          >
            {loading ? "Uploading..." : "Upload Students"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>

    {/* GUIDELINES MODAL SAME */}
  </>
);
}
