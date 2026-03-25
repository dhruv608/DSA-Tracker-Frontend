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
import { toastEvent } from '@/app/(auth)/shared/hooks/useToast';

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
      toastEvent(message, 'success');

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
      toastEvent(errorMessage, 'error');
      
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
        <DialogContent className="w-[95vw] max-w-[700px] p-0 overflow-hidden flex flex-col rounded-2xl">

          {/* HEADER */}
          <DialogHeader className="px-6 py-5 border-b bg-muted/40">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Bulk Upload Students
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              Upload multiple students quickly using CSV and batch selection.
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

            {/* FILE INPUT */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">CSV File</Label>

              <label className="w-full flex items-center justify-between border rounded-xl px-5 py-4 cursor-pointer hover:bg-muted/40 transition">
                <span className="text-sm text-muted-foreground">
                  {file ? file.name : "Choose CSV file"}
                </span>

                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-md">
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

            {/* GUIDE BUTTON */}
            <div className="flex justify-between items-center border rounded-lg px-4 py-3 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Need CSV format help?
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGuide(true)}
              >
                <FileText className="w-4 h-4 mr-1" />
                View Guidelines
              </Button>
            </div>

            {/* STATUS MESSAGES */}
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
                {csvData.length} students ready to upload 🚀
              </div>
            )}

          </div>

          {/* FOOTER */}
          <DialogFooter className="px-6 py-4 border-t flex gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>

            <Button
              disabled={isUploadDisabled}
              onClick={handleUpload}
              className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-primary to-amber-600"
            >
              {loading ? "Uploading..." : "Upload Students"}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* GUIDELINES MODAL */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="w-[90vw] max-w-[600px]">

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              CSV Format Guidelines
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">

            <div>
              <p className="text-muted-foreground text-xs mb-2">Required CSV Columns</p>
              <div className="bg-muted p-3 rounded font-mono text-xs">
                name,email,enrollment_id
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-xs mb-2">Example CSV</p>
              <div className="bg-muted p-3 rounded font-mono text-xs">
                Ayush Chaurasiya,ayush@pwioi.com,375<br/>
                John Doe,john@pwioi.com,376<br/>
                Jane Smith,jane@pwioi.com,377
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-semibold">Rules:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Only 3 columns: name, email, enrollment_id</li>
                <li>• All fields are required for each row</li>
                <li>• Email must be valid format</li>
                <li>• Email must contain pwioi.com domain</li>
                <li>• No extra columns allowed</li>
                <li>• Batch is selected via dropdowns (not in CSV)</li>
              </ul>
            </div>

            <div className="text-yellow-400 text-xs border border-yellow-500/20 bg-yellow-500/10 p-3 rounded">
              ⚠️ Do NOT include batch information in CSV. Use the City → Year → Batch dropdowns above.
            </div>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}
