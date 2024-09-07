// CodeDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export const CodeDialog = ({ ticketId }: { ticketId: string }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/ticket/verify/${ticketId}`,
        {
          code,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Code verification response:", response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setCode(value);
    setError("");
  };

  const handleSubmit = () => {
    if (code.length === 6) {
      // Handle the code submission logic here
      console.log("Submitted code:", code);
      handleVerifyCode();
      setCode("");
    } else {
      setError("Code must be exactly 6 digits.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2">Enter 6-Digit Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit code sent to your email or phone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={handleInputChange}
            maxLength={6}
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={code.length !== 6}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDialog;
