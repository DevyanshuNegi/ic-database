"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { processAddRequest, searchICsForMerge } from "@/app/actions/request-actions";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface RequestReviewModalProps {
  requestId: string;
  rawName: string;
  normalizedName: string;
  internName: string;
}

export function RequestReviewModal({ requestId, rawName, normalizedName, internName }: RequestReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"MERGE" | "APPROVE_AS_NEW" | "REJECT">("MERGE");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<{id: string, canonicalName: string}[]>([]);
  const [selectedIcId, setSelectedIcId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "MERGE" && open) {
      const delay = setTimeout(() => {
        if (search.trim().length >= 2) {
          searchICsForMerge(search).then(setOptions);
        } else {
          setOptions([]);
        }
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [search, mode, open]);

  const onConfirm = async () => {
    if (mode === "REJECT" && !note.trim()) {
      toast.error("Feedback note is required when rejecting.");
      return;
    }
    if (mode === "MERGE" && !selectedIcId) {
      toast.error("Please select an IC to merge with.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await processAddRequest(requestId, mode, {
        mergeWithIcId: mode === "MERGE" ? selectedIcId : undefined,
        reviewNote: note,
      });

      if (result.success) {
        toast.success(result.success);
        setOpen(false);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to process request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm">Review</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Add Request</DialogTitle>
          <DialogDescription>
             Intern: <strong>{internName}</strong> <br/>
             Requested Name: <strong className="text-zinc-900 dark:text-zinc-100">{rawName}</strong> <br/>
             Normalized: <span className="font-mono">{normalizedName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 border-b pb-2 mb-2">
          <Button variant={mode === "MERGE" ? "default" : "ghost"} size="sm" onClick={() => setMode("MERGE")}>
            Merge
          </Button>
          <Button variant={mode === "APPROVE_AS_NEW" ? "default" : "ghost"} size="sm" onClick={() => setMode("APPROVE_AS_NEW")}>
            Approve as New
          </Button>
          <Button variant={mode === "REJECT" ? "destructive" : "ghost"} size="sm" onClick={() => setMode("REJECT")}>
            Reject
          </Button>
        </div>

        <div className="py-2 min-h-[200px]">
          {mode === "MERGE" && (
             <div className="space-y-4">
               <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input 
                   placeholder="Search existing IC..." 
                   className="pl-9" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
               </div>
               
               <div className="border rounded-md overflow-y-auto max-h-[200px] h-[200px] bg-muted/20">
                 {options.length === 0 ? (
                   <div className="p-4 text-center text-sm text-muted-foreground">
                      {search.length < 2 ? "Type at least 2 characters to search" : "No ICs found."}
                   </div>
                 ) : (
                   <div className="p-1 flex flex-col gap-1">
                     {options.map((ic) => (
                        <div 
                           key={ic.id}
                           onClick={() => setSelectedIcId(ic.id)}
                           className={`px-3 py-2 text-sm rounded cursor-pointer ${selectedIcId === ic.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                           {ic.canonicalName}
                        </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
          )}

          {mode === "APPROVE_AS_NEW" && (
             <div className="space-y-2">
               <p className="text-sm">
                 This will create a new IC with the canonical name: <strong>{normalizedName}</strong>. 
                 The intern's task will then be successfully merged and linked to this IC.
               </p>
             </div>
          )}

          {mode === "REJECT" && (
             <div className="space-y-2">
               <label htmlFor="note" className="block text-sm font-medium">
                 Feedback Note <span className="text-destructive">*</span>
               </label>
               <Textarea
                 id="note"
                 value={note}
                 onChange={(e) => setNote(e.target.value)}
                 placeholder="Explain why this IC request is rejected (e.g. Invalid part number)..."
                 rows={4}
               />
             </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant={mode === "REJECT" ? "destructive" : "default"} 
            onClick={onConfirm} 
            disabled={
              isLoading || 
              (mode === "REJECT" && note.trim().length === 0) || 
              (mode === "MERGE" && !selectedIcId)
            }
          >
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
