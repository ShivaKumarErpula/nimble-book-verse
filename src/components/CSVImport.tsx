
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { importBooks } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { UploadIcon, XIcon, CheckIcon } from 'lucide-react';

interface CSVImportProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<{
    addedCount: number;
    errors: Array<{ row: number; message: string; data?: string }>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await importBooks(file);
      setImportResult(result);
      
      if (result.addedCount > 0) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.addedCount} books`,
        });
        
        if (result.errors.length === 0) {
          // If no errors, automatically close the import dialog
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        toast({
          title: "Import Failed",
          description: "No books were imported. Please check the errors.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Import Books from CSV</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-600">
          <p className="mb-2">CSV should have the following columns:</p>
          <code className="bg-gray-100 p-2 block rounded">title,author,publishedYear</code>
        </div>
        
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="csv-file"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV file only</p>
            </div>
            <input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        {file && (
          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded">
            <span className="text-sm font-medium truncate">{file.name}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setFile(null)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {importResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 py-3 bg-green-50 text-green-800 rounded">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 mr-2" />
                <span>Successfully imported {importResult.addedCount} books</span>
              </div>
            </div>
            
            {importResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Import Errors ({importResult.errors.length})</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm py-1 border-b border-gray-200 last:border-0">
                        <strong>Row {error.row}:</strong> {error.message}
                        {error.data && (
                          <div className="mt-1 font-mono text-xs bg-gray-800 text-white p-1 rounded overflow-x-auto">
                            {error.data}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          disabled={!file || isLoading} 
          onClick={handleImport}
        >
          {isLoading ? 'Importing...' : 'Import Books'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CSVImport;
