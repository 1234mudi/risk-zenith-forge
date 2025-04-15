
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

interface OrganizationInfoProps {
  organization: string;
  onOrganizationChange: (value: string) => void;
}

const OrganizationInfo = ({ organization, onOrganizationChange }: OrganizationInfoProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="organization" className="text-slate-700 font-semibold">Organization</Label>
      <div className="relative">
        <Input
          id="organization"
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          className="text-center font-medium bg-white"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <InfoIcon className="h-4 w-4 text-slate-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Organization Details</DialogTitle>
                <DialogDescription>
                  Additional information about this organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-sm">ID</h4>
                  <p className="text-sm text-slate-600">ORG-7890</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Description</h4>
                  <p className="text-sm text-slate-600">
                    A multinational banking corporation offering a wide range of financial services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Industry</h4>
                  <p className="text-sm text-slate-600">Banking & Financial Services</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Risk Profile</h4>
                  <p className="text-sm text-slate-600">Medium-High</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;
