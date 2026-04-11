"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Info, Download } from 'lucide-react';
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
import { getAllCities } from '@/services/city.service';
import { getAllBatches } from '@/services/batch.service';
import { City } from '@/types/superadmin/city.types';
import { Batch } from '@/types/superadmin/batch.types';
import { bulkUploadStudents } from '@/services/admin.service';
import { showSuccess } from '@/ui/toast';
import { BulkUploadModalProps, BulkUploadResult, CsvRowData } from '@/types/admin/student.types';

export default function BulkUploadModal({
  open,
  onOpenChange,
  onSuccess,
}: BulkUploadModalProps) {

  const [file, setFile] = useState<File | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [defaultPassword, setDefaultPassword] = useState<string>('password123');
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState<CsvRowData[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; totalRows: number; message: string } | null>(null);
  const [csvValidated, setCsvValidated] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const [showResult, setShowResult] = useState(false);

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
      setShowResult(false);
      setUploadResult(null);
      setValidationResult(null);
      setCsvValidated(false);
      setValidationError('');
      onOpenChange(false);
      // Reset form
      setFile(null);
      setSelectedCity('');
      setSelectedYear('');
      setSelectedBatch('');
      setDefaultPassword('password123');
      setCsvData([]);
    }
  };

  // CSV Validation
  const validateCSV = useCallback((data: CsvRowData[]) => {
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
          setValidationResult({
            isValid: false,
            totalRows: 0,
            message: 'CSV Validation Failed'
          });
          setCsvValidated(true);
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
          const row: CsvRowData = {} as CsvRowData;
          
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
          setValidationResult({
            isValid: false,
            totalRows: data.length,
            message: 'CSV Validation Failed'
          });
          setCsvValidated(true);
        } else {
          console.log('Validation passed!');
          setCsvData(data);
          setValidationResult({
            isValid: true,
            totalRows: data.length,
            message: `CSV Valid - ${data.length} students ready to upload`
          });
          setCsvValidated(true);
        }
      } catch (error) {
        console.error('CSV parsing error:', error);
        setValidationError('Failed to parse CSV file');
        setValidationResult({
          isValid: false,
          totalRows: 0,
          message: 'CSV Validation Failed'
        });
        setCsvValidated(true);
        setCsvData([]);
      }
    };

    reader.onerror = () => {
      setValidationError('Failed to read file');
      setValidationResult({
        isValid: false,
        totalRows: 0,
        message: 'CSV Validation Failed'
      });
      setCsvValidated(true);
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
        setValidationResult({
          isValid: false,
          totalRows: 0,
          message: 'CSV Validation Failed'
        });
        setCsvValidated(true);
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('batch_id', selectedBatch);

      console.log('Uploading file:', file.name, 'to batch:', selectedBatch);

      const result = await bulkUploadStudents(formData);

      console.log('Upload result:', result);

      setUploadResult(result);
      setShowResult(true);

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(result);
      }

      showSuccess(`Successfully uploaded ${result.inserted} students!`);
    } catch (error) {
      // Error is handled by API client interceptor
      console.error('Upload failed:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Upload failed. Please try again.';
      setValidationError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [file, selectedBatch, onSuccess]);

  // Download sample CSV
  const downloadSampleCSV = useCallback(() => {
    const sampleData = [
      ['name', 'email', 'enrollment_id'],
      ['John Doe', 'john.doe@pwioi.com', 'ENR001'],
      ['Jane Smith', 'jane.smith@pwioi.com', 'ENR002']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  // Check if upload should be disabled
  const isUploadDisabled = !selectedCity || !selectedYear || !selectedBatch || !file || !csvValidated || !validationResult?.isValid || loading;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[95vw] max-h-[90vh] max-w-[520px] p-0 flex flex-col rounded-2xl">

          {/* HEADER */}
          <DialogHeader className="px-6 py-5 border-b border-border/40">
            <DialogTitle className="text-lg font-semibold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              Bulk Upload Students
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Upload multiple students via CSV file
            </DialogDescription>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">

            {/* LOCATION */}
            <div className="space-y-5 p-5 rounded-2xl border border-border/40 bg-muted/20">

              <p className="text-xs font-semibold text-muted-foreground">
                Target Location
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

            {/* FILE UPLOAD */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">
                CSV File <span className="text-destructive">*</span>
              </Label>

              <div className="border-2 border-dashed border-border/60 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {file ? file.name : 'Click to upload CSV'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file ? 'File selected' : 'or drag and drop'}
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Selected:</span>
                  <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                  <button
                    onClick={() => {
                      setFile(null);
                      setCsvValidated(false);
                      setValidationResult(null);
                      setValidationError('');
                    }}
                    className="text-red-500 hover:text-red-600"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* VALIDATION RESULT */}
            {csvValidated && validationResult && (
              <div className={`rounded-2xl p-4 ${
                validationResult.isValid 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                <div className="flex items-start gap-3">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="space-y-2">
                    <p className="font-medium">
                      {validationResult.isValid 
                        ? validationResult.message
                        : 'CSV Validation Failed'
                      }
                    </p>
                    
                    {!validationResult.isValid && validationError && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Errors found:</p>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li>{validationError}</li>
                        </ul>
                      </div>
                    )}
                    
                    {validationResult.isValid && validationResult.totalRows > 0 && (
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <p className="text-sm">
                          Ready to create {validationResult.totalRows} students
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GUIDE */}
            <div className="rounded-2xl px-4 py-3 bg-muted/20 border border-border/40">
              <div className="text-center mb-3">
                <p className="text-sm text-muted-foreground">
                  Need CSV format help?
                </p>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadSampleCSV}
                  className="rounded w-full max-w-xs"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample CSV
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGuide(true)}
                  className="rounded w-full max-w-xs"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Format Guide
                </Button>
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
              disabled={isUploadDisabled}
              onClick={handleUpload}
              className="h-11 w-full font-semibold bg-primary text-black hover:opacity-90 transition-all"
            >
              {loading ? "Uploading..." : "Upload Students"}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* GUIDE MODAL */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="w-[95vw] max-h-[90vh] max-w-[920px] p-0 rounded-2xl">

          {/* HEADER */}
          <DialogHeader className="px-6 py-4 bg-muted/40">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="w-5 h-5 text-primary" />
              CSV Format Guide
            </DialogTitle>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">

            {/* REQUIRED COLUMNS */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Required Columns
              </p>

              <div className="bg-background rounded-lg p-4 text-sm font-mono overflow-x-auto">
                name, email, enrollment_id
              </div>
            </div>

            {/* RULES */}
            <div className="grid grid-cols-3 gap-4">

              <div className="rounded-xl p-4 bg-muted/30 space-y-1">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-semibold">Student's full name</p>
              </div>

              <div className="rounded-xl p-4 bg-muted/30 space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-semibold">Must contain @pwioi.com</p>
              </div>

              <div className="rounded-xl p-4 bg-muted/30 space-y-1">
                <p className="text-xs text-muted-foreground">Enrollment ID</p>
                <p className="text-sm font-semibold">Unique identifier</p>
              </div>

            </div>

            {/* EXAMPLE */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Example Row
              </p>

              <div className="bg-background rounded-lg p-4 text-sm font-mono overflow-x-auto">
                "Dhruv", "dhruv.sot2428@pwioi.com", "2401010031"
              </div>
            </div>

            {/* WARNING */}
            <div className="flex items-start gap-3 rounded-lg border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <p>
                Do <span className="font-semibold">NOT</span> include city, year, or batch in CSV.
                Always select batch using dropdown.
                Make sure all email addresses contain the <span className="font-semibold">pwioi.com</span> domain.
              </p>
            </div>

          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-between">
            <Button
              variant="outline"
              onClick={downloadSampleCSV}
              className="rounded"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample CSV
            </Button>
            
            <Button variant="ghost" onClick={() => setShowGuide(false)}>
              Close
            </Button>
          </div>

        </DialogContent>
      </Dialog>

      {/* UPLOAD RESULT MODAL */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="w-[95vw] max-h-[90vh] max-w-[500px] p-0 overflow-hidden rounded-2xl">
          
          {/* HEADER */}
          <DialogHeader className="px-6 py-4 bg-muted/40">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Upload Complete
            </DialogTitle>
          </DialogHeader>

          {/* BODY */}
          <div className="p-6 space-y-4 overflow-y-auto no-scrollbar">
            
            {/* SUMMARY */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
              <p className="text-green-400 font-medium mb-2">
                {uploadResult?.message || 'Students uploaded successfully'}
              </p>
            </div>

            {/* DETAILED STATS */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Total Rows in CSV</span>
                <span className="font-semibold">{uploadResult?.totalRows || 0}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Successfully Uploaded</span>
                <span className="font-semibold text-green-500">{uploadResult?.inserted || 0}</span>
              </div>
              
              {(uploadResult?.duplicates && uploadResult.duplicates > 0) && (
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Duplicate Students (Skipped)</span>
                  <span className="font-semibold text-yellow-500">{uploadResult.duplicates}</span>
                </div>
              )}

              {(uploadResult?.invalidRows && uploadResult.invalidRows > 0) && (
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Invalid Rows (Skipped)</span>
                  <span className="font-semibold text-red-500">{uploadResult.invalidRows}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Total Skipped</span>
                <span className="font-semibold text-orange-500">{uploadResult?.skipped || 0}</span>
              </div>
            </div>

            {/* INFO */}
            <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <p>Duplicate students were not uploaded because they already exist in system.</p>
              <p>Invalid rows had incorrect format or missing required fields.</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t">
            <Button 
              onClick={() => {
                setShowResult(false);
                setUploadResult(null);
                handleClose();
              }} 
              className="w-full"
            >
              Done
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}
