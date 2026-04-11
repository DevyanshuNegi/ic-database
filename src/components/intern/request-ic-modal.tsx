"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { requestIcAction } from "@/app/actions/request-ic";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function RequestIcModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await requestIcAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        setOpen(false);
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Request New IC
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request New IC</DialogTitle>
          <DialogDescription>
            Can't find an IC in the catalog? Enter its name or part number here.
            An admin will review it.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="icName">IC Name or Part Number</Label>
            <Input
              id="icName"
              name="icName"
              placeholder="e.g., UA741, LM386"
              className="uppercase"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Check & Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
