import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Building, Mail, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ClientDetailsProps {
  clientDetails: {
    name: string;
    company: string;
    email: string;
    phone: string;
    description: string;
  };
  onUpdate: (details: {
    name: string;
    company: string;
    email: string;
    phone: string;
    description: string;
  }) => void;
}

const ClientDetailsSection = ({ clientDetails, onUpdate }: ClientDetailsProps) => {
  const { t } = useI18n();
  
  const handleChange = (field: string, value: string) => {
    onUpdate({ ...clientDetails, [field]: value });
  };

  return (
    <Card className="card-gradient slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-primary" />
          <span>{t('client_details')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{t('client_name')}</span>
            </Label>
            <Input
              id="clientName"
              placeholder={t('client_name_placeholder')}
              value={clientDetails.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input-enhanced"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>{t('company')}</span>
            </Label>
            <Input
              id="company"
              placeholder={t('company_placeholder')}
              value={clientDetails.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="input-enhanced"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{t('email')}</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('email_placeholder')}
              value={clientDetails.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="input-enhanced"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{t('phone')}</span>
            </Label>
            <Input
              id="phone"
              placeholder={t('phone_placeholder')}
              value={clientDetails.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="input-enhanced"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('project_description')}</Label>
          <Textarea
            id="description"
            placeholder={t('project_description_placeholder')}
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