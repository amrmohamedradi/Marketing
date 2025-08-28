import { useEffect, useState, memo, useCallback, useRef } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit3, 
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Code,
  Camera,
  Headphones,
  Award,
  Clock,
  Users,
  Shield,
  Zap,
  Heart
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import * as LucideIcons from "lucide-react"; // Import all Lucide icons
import { motion } from "framer-motion";

interface SubService {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon; // Change from string to LucideIcon
  subServices: SubService[];
  isDefault?: boolean; // Add this line
  originalId?: string; // Add this line
}

interface ServicesSectionProps {
  services: Service[];
  onUpdate: (services: Service[]) => void;
}

// Build three default services with suggestions
const buildDefaultServices = (t: (key: string) => string): Service[] => {
  const base: Array<{ id: string; nameKey: string; description: string; icon: string }> = [
    { id: "programming", nameKey: "programming", description: "", icon: "Code" },
    { id: "marketing", nameKey: "marketing", description: "", icon: "TrendingUp" },
    { id: "photo-shoot", nameKey: "photo_editing", description: "", icon: "Camera" }
  ];
  return base.map((s) => ({
    id: s.id,
    name: t(s.nameKey),
    description: s.description,
    icon: LucideIcons[s.icon as keyof typeof LucideIcons] as LucideIcon,
    subServices: [],
    isDefault: true, // Mark as default service
    originalId: s.nameKey, // Store original key
  }));
};

type SubServiceRowProps = {
  subService: SubService;
  isEditing: boolean;
  onToggleEdit: (subServiceId: string, edit: boolean) => void;
  onUpdateField: (subServiceId: string, field: 'name' | 'description', value: string) => void;
  onDelete: (subServiceId: string) => void;
};

const SubServiceRow = memo(({ subService, isEditing, onToggleEdit, onUpdateField, onDelete }: SubServiceRowProps) => {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-3 bg-muted/20 rounded-md border border-border/30"
    >
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={subService.name}
              onChange={(e) => onUpdateField(subService.id, 'name', e.target.value)}
              className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 text-sm"
            />
            <Input
              value={subService.description}
              onChange={(e) => onUpdateField(subService.id, 'description', e.target.value)}
              className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 text-sm"
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-sm text-foreground">{t(subService.name)}</span>
              {subService.isCustom && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{t('custom')}</Badge>
              )}
            </div>
            {subService.description && (
              <p className="text-xs text-muted-foreground mt-1 ml-6 text-center sm:text-left">
                {t(subService.description)}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-1">
        {isEditing ? (
          <Button size="sm" onClick={() => onToggleEdit(subService.id, false)} className="hover:bg-primary/10 text-primary hover:text-primary transition-colors duration-200">
            <CheckCircle className="w-3 h-3" />
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => onToggleEdit(subService.id, true)} className="hover:bg-muted/50 transition-colors duration-200">
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDelete(subService.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
});
SubServiceRow.displayName = 'SubServiceRow';

const ServicesSection = ({ services, onUpdate }: ServicesSectionProps) => {
  const { t, currentLanguage } = useI18n();
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [editingSubService, setEditingSubService] = useState<string | null>(null);
  const [customSubService, setCustomSubService] = useState({ name: "", description: "" });
  const [newService, setNewService] = useState({ name: "", description: "" });
  // Pending changes per service (not yet saved)
  const [pending, setPending] = useState<Record<string, {
    customDrafts: { id: string; name: string; description: string; isEditing?: boolean }[];
    editedMain?: { name?: string; description?: string };
    newName?: string;
    newDescription?: string;
  }>>({});

  const SUPPORT_ITEMS = [
    {
      icon: Headphones,
      title: t("support_24_7_title"),
      description: t("support_24_7_description")
    },
    {
      icon: Award,
      title: t("quality_guarantee_title"),
      description: t("quality_guarantee_description")
    },
    {
      icon: Clock,
      title: t("on_time_delivery_title"),
      description: t("on_time_delivery_description")
    },
    {
      icon: Users,
      title: t("dedicated_team_title"),
      description: t("dedicated_team_description")
    },
    {
      icon: Shield,
      title: t("secure_process_title"),
      description: t("secure_process_description")
    },
    {
      icon: Zap,
      title: t("fast_turnaround_title"),
      description: t("fast_turnaround_description")
    }
  ];

  // Seed three predefined services on first mount if empty, or re-translate if language changes
  useEffect(() => {
    // If services array is empty, initialize with default services
    if (!services || services.length === 0) {
      onUpdate(buildDefaultServices(t));
    }
    // If language has changed and there are default services, re-translate them
    else if (prevLanguageRef.current !== currentLanguage) {
      const updatedServices = services.map(service => {
        if (service.isDefault && service.originalId) {
          const newName = t(service.originalId);
          return {
            ...service,
            name: newName,
          };
        }
        return service; // Keep non-default services as they are
      });
      onUpdate(updatedServices);
    }

    prevLanguageRef.current = currentLanguage;

  }, [services, onUpdate, t, currentLanguage]); // Add currentLanguage to dependency array

  const prevLanguageRef = useRef<string>(currentLanguage);

  // No dynamic icon picker needed for predefined services

  const toggleServiceExpansion = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  // No suggested-item handlers in this variant

  const stageCustomSubService = (serviceId: string) => {
    if (!customSubService.name.trim()) return;
    const draft = { id: Date.now().toString(), name: customSubService.name, description: customSubService.description };
    setPending((prev) => {
      const current = prev[serviceId] ?? { customDrafts: [] };
      return { ...prev, [serviceId]: { ...current, customDrafts: [...current.customDrafts, draft] } };
    });
    setCustomSubService({ name: "", description: "" });
  };

  const removeCustomDraft = (serviceId: string, draftId: string) => {
    setPending((prev) => {
      const current = prev[serviceId];
      if (!current) return prev;
      return { ...prev, [serviceId]: { ...current, customDrafts: current.customDrafts.filter(d => d.id !== draftId) } };
    });
  };

  const toggleEditCustomDraft = (serviceId: string, draftId: string, edit: boolean) => {
    setPending((prev) => {
      const current = prev[serviceId];
      if (!current) return prev;
      const updatedDrafts = current.customDrafts.map(d => d.id === draftId ? { ...d, isEditing: edit } : d);
      return { ...prev, [serviceId]: { ...current, customDrafts: updatedDrafts } };
    });
  };

  const updateCustomDraftField = (serviceId: string, draftId: string, field: 'name' | 'description', value: string) => {
    setPending((prev) => {
      const current = prev[serviceId];
      if (!current) return prev;
      const updatedDrafts = current.customDrafts.map(d => d.id === draftId ? { ...d, [field]: value } : d);
      return { ...prev, [serviceId]: { ...current, customDrafts: updatedDrafts } };
    });
  };

  const deleteSubService = useCallback((serviceId: string, subServiceId: string) => {
    const updatedServices = services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          subServices: service.subServices.filter(sub => sub.id !== subServiceId)
        };
      }
      return service;
    });
    onUpdate(updatedServices);
  }, [services, onUpdate]);

  const deleteService = (serviceId: string) => {
    onUpdate(services.filter(service => service.id !== serviceId));
    setPending((prev) => {
      const copy = { ...prev };
      delete copy[serviceId];
      return copy;
    });
  };

  const updateSubService = useCallback((serviceId: string, subServiceId: string, field: string, value: string) => {
    const updatedServices = services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          subServices: service.subServices.map(sub => {
            if (sub.id === subServiceId) {
              return { ...sub, [field]: value };
            }
            return sub;
          })
        };
      }
      return service;
    });
    onUpdate(updatedServices);
  }, [services, onUpdate]);

  const savePending = (serviceId: string) => {
    const pendingForService = pending[serviceId];
    if (!pendingForService || pendingForService.customDrafts.length === 0) return;
    const updated = services.map((service) => {
      if (service.id !== serviceId) return service;
      const newFromCustom: SubService[] = pendingForService.customDrafts.map((d) => ({ id: d.id, name: d.name, description: d.description, isCustom: true }));
      return {
        ...service,
        subServices: [...service.subServices, ...newFromCustom],
      };
    });
    onUpdate(updated);
    setPending((prev) => ({ ...prev, [serviceId]: { customDrafts: [] } }));
  };

  const addService = () => {
    const name = newService.name.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const service: Service = {
      id,
      name,
      description: newService.description,
      icon: Settings, // Store icon component directly
      subServices: [],
    };
    onUpdate([...(services ?? []), service]);
    setNewService({ name: "", description: "" });
    setExpandedServices((s) => new Set<string>([...Array.from(s), id]));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="rounded-2xl shadow-lg border border-border bg-card text-card-foreground overflow-hidden p-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-center sm:justify-start space-x-2 text-primary">
            <Settings className="w-5 h-5" />
            <span>{t('our_services')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create new main service */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col gap-3"> {/* Changed from grid to flex column */}
              <Input
                placeholder={t('service_name_placeholder')}
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
              />
              <Input
                placeholder={t('service_description_placeholder')}
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
              />
              <Button onClick={addService} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-md transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-95">
                <Plus className="w-4 h-4 mr-2" />
                {t('add_service')}
              </Button>
            </div>
          </div>
 
          {/* Services - full width stacked panels */}
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => {
              const Icon = service.icon; // Directly use service.icon
              const isExpanded = expandedServices.has(service.id);
              const pendingForService = pending[service.id] ?? { customDrafts: [] };
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="group relative"
                >
                  <Card className="rounded-xl border border-border/50 bg-background p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    
                    <CardHeader className="relative z-10 p-4 border-b border-border/50 bg-muted/10">
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex flex-col items-center sm:items-start">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200 text-foreground">
                              {service.name}
                            </h3>
                            <Badge variant="secondary" className="mt-1 bg-accent/10 text-accent border-accent/20 text-xs px-3 py-1 mx-auto sm:mx-0">
                              {service.subServices.length} {t('items')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleServiceExpansion(service.id)} className="hover:bg-muted/50 transition-colors duration-200">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteService(service.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 text-center sm:text-left">
                        {service.description}
                      </p>
                    </CardHeader>
                    
                    {/* Expandable Content */}
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-4 space-y-4">
                        {/* Current Sub-services (render only when expanded) */}
                        {isExpanded && service.subServices.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{t('included_services')}</h4>
                            <div className="space-y-2">
                              {service.subServices.map((subService) => (
                                <SubServiceRow
                                  key={subService.id}
                                  subService={subService}
                                  isEditing={editingSubService === subService.id}
                                  onToggleEdit={(id, edit) => setEditingSubService(edit ? id : null)}
                                  onUpdateField={(id, field, value) => updateSubService(service.id, id, field, value)}
                                  onDelete={(id) => deleteSubService(service.id, id)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pending Custom Drafts */}
                        {pendingForService.customDrafts.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{t('pending_custom_items')}</h4>
                            <div className="space-y-2">
                              {pendingForService.customDrafts.map((d) => (
                                <motion.div
                                  key={d.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.3 }}
                                  className="p-3 bg-muted/20 rounded-md border border-border/30"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      {d.isEditing ? (
                                        <div className="space-y-2">
                                          <Input value={d.name} onChange={(e) => updateCustomDraftField(service.id, d.id, 'name', e.target.value)} className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 text-sm" />
                                          <Input value={d.description} onChange={(e) => updateCustomDraftField(service.id, d.id, 'description', e.target.value)} className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 text-sm" />
                                        </div>
                                      ) : (
                                        <div>
                                          <div className="font-medium text-sm text-foreground">{d.name}</div>
                                          {d.description && <div className="text-xs text-muted-foreground">{d.description}</div>}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {d.isEditing ? (
                                        <Button size="sm" onClick={() => toggleEditCustomDraft(service.id, d.id, false)} className="hover:bg-primary/10 text-primary hover:text-primary transition-colors duration-200"><CheckCircle className="w-3 h-3" /></Button>
                                      ) : (
                                        <Button size="sm" variant="ghost" onClick={() => toggleEditCustomDraft(service.id, d.id, true)} className="hover:bg-muted/50 transition-colors duration-200"><Edit3 className="w-3 h-3" /></Button>
                                      )}
                                      <Button size="sm" variant="ghost" onClick={() => removeCustomDraft(service.id, d.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"><X className="w-3 h-3" /></Button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add Sub-service (always visible, simple) */}
                        <div className="space-y-2 p-3 bg-muted/10 rounded-md border border-border/30">
                          <div className="grid grid-cols-1 gap-2">
                              <Input
                              placeholder={t('subservice_name_ph')}
                                value={customSubService.name}
                                onChange={(e) => setCustomSubService({ ...customSubService, name: e.target.value })}
                              className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 text-sm"
                              />
                              <Input
                                placeholder={t('subservice_desc_ph')}
                                value={customSubService.description}
                                onChange={(e) => setCustomSubService({ ...customSubService, description: e.target.value })}
                              className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 text-sm"
                              />
                            </div>
                          <div>
                            <Button size="sm" onClick={() => stageCustomSubService(service.id)} className="mt-2 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-md transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-95">
                                <Plus className="w-3 h-3 mr-1" />
                                {t('add')}
                              </Button>
                            </div>
                          </div>

                        {/* Save Pending */}
                        <div className="flex justify-center">
                          <Button size="sm" onClick={() => savePending(service.id)} disabled={pendingForService.customDrafts.length === 0} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md rounded-md transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-95">
                            {t('save')}
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Support & Benefits Section */}
      <Card className="rounded-2xl shadow-lg border border-border bg-card text-card-foreground p-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Heart className="w-5 h-5" />
            <span>{t('support_benefits')}</span>
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {t('support_benefits_desc')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUPPORT_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group p-6 rounded-xl bg-gradient-to-br from-background/50 to-muted/20 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300 text-foreground text-wrap">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground text-wrap">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServicesSection;