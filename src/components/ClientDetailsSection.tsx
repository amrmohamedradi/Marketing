import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Building, Mail, Phone } from "lucide-react";

interface ClientDetailsProps {
  clientDetails: {
    name: string;
    company: string;
    email: string;
    phone: string;
    description: string;
  };
  onUpdate: (details: any) => void;
}

const ClientDetailsSection = ({ clientDetails, onUpdate }: ClientDetailsProps) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({ ...clientDetails, [field]: value });
  };

  return (
    <Card className="card-gradient slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-primary" />
          <span>Client Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Client Name</span>
            </Label>
            <Input
              id="clientName"
              placeholder="Enter client's full name"
              value={clientDetails.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input-enhanced"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>Company</span>
            </Label>
            <Input
              id="company"
              placeholder="Company or organization name"
              value={clientDetails.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="input-enhanced"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="client@company.com"
              value={clientDetails.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="input-enhanced"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={clientDetails.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="input-enhanced"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the project or requirements..."
            value={clientDetails.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="input-enhanced min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDetailsSection;