import { useState } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const ReceiptUpload = ({ onReceiptProcessed }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Error", description: "Please select a file to upload." });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = reader.result.split(",")[1];

        const response = await axios.post(
          "/api/receipts/analyze",
          { base64Content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast({
          title: "Receipt Analyzed",
          description: "Your receipt has been successfully analyzed.",
        });
        onReceiptProcessed(response.data);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze the receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative border-2 border-dashed rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <label htmlFor="fileInput" className="cursor-pointer">
              <Button
                variant="outline"
                className="mx-auto"
                onClick={handleFileClick}
              >
                Upload Receipt
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
          </div>
          <p className="text-sm text-gray-500">
            Drag and drop or click to upload
          </p>
        </div>

        <div className="relative border-2 border-dashed rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <Camera className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <Button
              variant="outline"
              className="mx-auto"
              onClick={handleFileUpload}
            >
              Analyze Receipt
              <Camera className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Use your camera to capture receipt
          </p>
        </div>
      </div>
      {selectedFile && (
        <div id="file-name" className="text-sm text-gray-500">
          Selected: {selectedFile.name}
        </div>
      )}
      {selectedFile && (
        <Button
          className="w-full animate-fade-in"
          onClick={handleFileUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Receipt...
            </>
          ) : (
            "Submit Receipt"
          )}
        </Button>
      )}
    </>
  );
};

export default ReceiptUpload;
