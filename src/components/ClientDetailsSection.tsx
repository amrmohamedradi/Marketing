import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Building, Mail, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

interface ClientDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
}

interface ClientDetailsProps {
  clientDetails: ClientDetails;
  onUpdate: (details: ClientDetails) => void;
}

const ClientDetailsSection = ({ clientDetails, onUpdate }: ClientDetailsProps) => {
  const { t } = useI18n();
  
  const handleChange = (field: keyof ClientDetails, value: string) => {
    onUpdate({ ...clientDetails, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-2xl shadow-lg border border-border bg-card text-card-foreground p-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-center sm:justify-start space-x-2 text-primary">
            <User className="w-5 h-5" />
            <span>{t('client_details')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-center sm:text-left">
              <Label htmlFor="clientName" className="flex items-center justify-center sm:justify-start space-x-1 text-foreground">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{t('client_name')}</span>
              </Label>
              <Input
                id="clientName"
                placeholder={t('client_name_placeholder')}
                value={clientDetails.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <Label htmlFor="company" className="flex items-center justify-center sm:justify-start space-x-1 text-foreground">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>{t('company')}</span>
              </Label>
              <Input
                id="company"
                placeholder={t('company_placeholder')}
                value={clientDetails.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <Label htmlFor="email" className="flex items-center justify-center sm:justify-start space-x-1 text-foreground">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{t('email')}</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('email_placeholder')}
                value={clientDetails.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <Label htmlFor="phone" className="flex items-center justify-center sm:justify-start space-x-1 text-foreground">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{t('phone')}</span>
              </Label>
              <Input
                id="phone"
                placeholder={t('phone_placeholder')}
                value={clientDetails.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
              />
            </div>
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <Label htmlFor="description" className="text-foreground flex items-center justify-center sm:justify-start">{t('project_description')}</Label>
            <Textarea
              id="description"
              placeholder={t('project_description_placeholder')}
              value={clientDetails.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientDetailsSection;