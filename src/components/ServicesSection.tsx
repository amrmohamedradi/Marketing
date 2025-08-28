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
  icon: LucideIcon;
  subServices: SubService[];
  suggestedItems: { name: string; description: string }[];
  isDefault?: boolean; // Add this line
  originalId?: string; // Add this line
}

interface ServicesSectionProps {
  services: Service[];
  onUpdate: (services: Service[]) => void;
}

// Generate simple suggestions based on service name
const generateSuggestions = (serviceName: string, t: (key: string) => string): { name: string; description: string }[] => {
  const n = serviceName.toLowerCase();
  if (n.includes("market") || n.includes(t("marketing").toLowerCase())) {
    return [
      { name: t("instagram_posts"), description: t("monthly_content_plan") },
      { name: t("reels_10"), description: t("short_video_edits") },
      { name: t("facebook_ads"), description: t("setup_optimization") },
      { name: t("reports"), description: t("monthly_performance_report") },
    ];
  }
  if (n.includes("photo") || n.includes("edit") || n.includes(t("photo_editing").toLowerCase())) {
    return [
      { name: t("product_photos"), description: t("lighting_editing") },
      { name: t("portrait_editing"), description: t("skin_color_grading") },
      { name: t("feature_videos"), description: t("sixty_ninety_sec_edits") },
      { name: t("delivery"), description: t("web_ready_export") },
    ];
  }
  if (n.includes("program") || n.includes("dev") || n.includes("app") || n.includes("web") || n.includes(t("programming").toLowerCase())) {
    return [
      { name: t("frontend_ui"), description: t("responsive_react_screens") },
      { name: t("api_endpoints"), description: t("rest_graphql") },
      { name: t("database_schema"), description: t("design_migration") },
      { name: t("documentation"), description: t("setup_usage_notes") },
    ];
  }
  return [
    { name: t("discovery"), description: t("goals_requirements") },
    { name: t("implementation"), description: t("core_deliverable") },
    { name: t("quality_assurance"), description: t("testing_fixes") },
  ];
};

// Build three default services with suggestions
const buildDefaultServices = (t: (key: string) => string): Service[] => {
  const base: Array<{ id: string; nameKey: string; description: string; icon: LucideIcon }> = [
    { id: "programming", nameKey: "programming", description: "", icon: Code },
    { id: "marketing", nameKey: "marketing", description: "", icon: TrendingUp },
    { id: "photo-shoot", nameKey: "photo_editing", description: "", icon: Camera }
  ];
  return base.map((s) => ({
    id: s.id,
    name: t(s.nameKey),
    description: s.description,
    icon: s.icon,
    subServices: [],
    suggestedItems: generateSuggestions(t(s.nameKey), t),
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
    <div className="flex items-center justify-between p-3 bg-muted/20 rounded border border-border/30">
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={subService.name}
              onChange={(e) => onUpdateField(subService.id, 'name', e.target.value)}
              className="text-sm"
            />
            <Input
              value={subService.description}
              onChange={(e) => onUpdateField(subService.id, 'description', e.target.value)}
              className="text-sm"
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-sm">{subService.name}</span>
              {subService.isCustom && (
                <Badge variant="outline" className="text-xs">{t('custom')}</Badge>
              )}
            </div>
            {subService.description && (
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                {subService.description}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-1">
        {isEditing ? (
          <Button size="sm" onClick={() => onToggleEdit(subService.id, false)}>
            <CheckCircle className="w-3 h-3" />
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => onToggleEdit(subService.id, true)}>
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDelete(subService.id)} className="text-destructive hover:text-destructive">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
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
    selectedSuggested?: Set<string>;
    editedSuggested?: Record<string, { name: string; description: string }>;
    deletedSuggested?: Set<string>;
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
            suggestedItems: generateSuggestions(newName, t)
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
    if (!pendingForService || (pendingForService.customDrafts.length === 0 && !(pendingForService.selectedSuggested && pendingForService.selectedSuggested.size > 0))) return;
    const updated = services.map((service) => {
      if (service.id !== serviceId) return service;
      const newFromCustom: SubService[] = pendingForService.customDrafts.map((d) => ({ id: d.id, name: d.name, description: d.description, isCustom: true }));
      const selectedSuggestedItems = service.suggestedItems.filter((s) => pendingForService.selectedSuggested?.has(s.name));
      const newFromSuggested: SubService[] = selectedSuggestedItems.map((s) => ({ id: `${service.id}-sug-${s.name}-${Date.now()}`, name: s.name, description: s.description, isCustom: false }));
      return {
        ...service,
        subServices: [...service.subServices, ...newFromSuggested, ...newFromCustom],
        suggestedItems: service.suggestedItems.filter((s) => !(pendingForService.selectedSuggested?.has(s.name)))
      };
    });
    onUpdate(updated);
    setPending((prev) => ({ ...prev, [serviceId]: { customDrafts: [], selectedSuggested: new Set<string>() } }));
  };

  const addService = () => {
    const name = newService.name.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const service: Service = {
      id,
      name,
      description: newService.description,
      icon: Settings,
      subServices: [],
      suggestedItems: []
    };
    onUpdate([...(services ?? []), service]);
    setNewService({ name: "", description: "" });
    setExpandedServices((s) => new Set<string>([...Array.from(s), id]));
  };

  return (
    <div className="space-y-8">
      <Card className="card-gradient slide-up overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>{t('our_services')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create new main service */}
          <div className="p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder={t('service_name_placeholder')}
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="input-enhanced"
              />
              <Input
                placeholder={t('service_description_placeholder')}
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="input-enhanced"
              />
              <Button onClick={addService} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                {t('add_service')}
              </Button>
            </div>
          </div>
 
          {/* Services - full width stacked panels */}
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              const isExpanded = expandedServices.has(service.id);
              const pendingForService = pending[service.id] ?? { customDrafts: [] };
              
              return (
                <div
                  key={service.id}
                  className="group relative"
                >
                  <Card className="border border-border/50 bg-background p-0">
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                              {service.name}
                            </h3>
                            <Badge variant="secondary" className="mt-1">
                              {service.subServices.length} {t('items')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleServiceExpansion(service.id)} className="hover:bg-primary/10">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteService(service.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {service.description}
                      </p>
                    </CardHeader>
                    
                    {/* Expandable Content */}
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <CardContent className="pt-0 space-y-4">
                        {/* Current Sub-services (render only when expanded) */}
                        {isExpanded && service.subServices.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">{t('included_services')}</h4>
                            {service.subServices.map((subService) => (
                              <div key={subService.id} className="flex items-center justify-between p-3 bg-muted/20 rounded border border-border/30">
                                <div className="flex-1">
                                  {editingSubService === subService.id ? (
                                    <div className="space-y-2">
                                      <Input
                                        value={subService.name}
                                        onChange={(e) => updateSubService(service.id, subService.id, "name", e.target.value)}
                                        className="input-enhanced text-sm"
                                      />
                                      <Input
                                        value={subService.description}
                                        onChange={(e) => updateSubService(service.id, subService.id, "description", e.target.value)}
                                        className="input-enhanced text-sm"
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span className="font-medium text-sm">{subService.name}</span>
                                        {subService.isCustom && (
                                          <Badge variant="outline" className="text-xs">{t('custom')}</Badge>
                                        )}
                                      </div>
                                      {subService.description && (
                                        <p className="text-xs text-muted-foreground mt-1 ml-6">
                                          {subService.description}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  {editingSubService === subService.id ? (
                                    <Button
                                      size="sm"
                                      onClick={() => setEditingSubService(null)}
                                      className="btn-ghost-primary"
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingSubService(subService.id)}
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteSubService(service.id, subService.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* No suggested items in this variant */}

                        {/* Pending Custom Drafts */}
                        {pendingForService.customDrafts.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">{t('pending_custom_items')}</h4>
                            <div className="space-y-2">
                              {pendingForService.customDrafts.map((d) => (
                                <div key={d.id} className="p-3 bg-muted/20 rounded-lg border border-border/30 animate-fade-in">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      {d.isEditing ? (
                                        <div className="space-y-2">
                                          <Input value={d.name} onChange={(e) => updateCustomDraftField(service.id, d.id, 'name', e.target.value)} className="input-enhanced text-sm" />
                                          <Input value={d.description} onChange={(e) => updateCustomDraftField(service.id, d.id, 'description', e.target.value)} className="input-enhanced text-sm" />
                                        </div>
                                      ) : (
                                        <div>
                                          <div className="font-medium text-sm">{d.name}</div>
                                          {d.description && <div className="text-xs text-muted-foreground">{d.description}</div>}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {d.isEditing ? (
                                        <Button size="sm" onClick={() => toggleEditCustomDraft(service.id, d.id, false)} className="btn-ghost-primary"><CheckCircle className="w-3 h-3" /></Button>
                                      ) : (
                                        <Button size="sm" variant="ghost" onClick={() => toggleEditCustomDraft(service.id, d.id, true)}><Edit3 className="w-3 h-3" /></Button>
                                      )}
                                      <Button size="sm" variant="ghost" onClick={() => removeCustomDraft(service.id, d.id)} className="text-destructive hover:text-destructive"><X className="w-3 h-3" /></Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested Items (select to stage) */}
                        {isExpanded && service.suggestedItems.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">{t('suggested')}</h4>
                            <div className="space-y-2">
                              {service.suggestedItems.map((item) => {
                                const p = pendingForService;
                                const selected = p.selectedSuggested?.has(item.name) ?? false;
                                return (
                                  <label key={item.name} className="flex items-start gap-2 p-2 rounded border border-dashed border-border/40">
                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      onChange={() => {
                                        setPending((prev) => {
                                          const current = prev[service.id] ?? { customDrafts: [] };
                                          const nextSel = new Set(current.selectedSuggested ?? new Set<string>());
                                          if (nextSel.has(item.name)) nextSel.delete(item.name); else nextSel.add(item.name);
                                          return { ...prev, [service.id]: { ...current, selectedSuggested: nextSel } };
                                        });
                                      }}
                                      className="mt-1"
                                    />
                                    <div>
                                      <div className="font-medium text-sm">{item.name}</div>
                                      {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Add Sub-service (always visible, simple) */}
                        <div className="space-y-2 p-3 bg-muted/10 rounded border border-border/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Input
                              placeholder={t('subservice_name_ph')}
                                value={customSubService.name}
                                onChange={(e) => setCustomSubService({ ...customSubService, name: e.target.value })}
                              className="text-sm"
                              />
                              <Input
                                placeholder={t('subservice_desc_ph')}
                                value={customSubService.description}
                                onChange={(e) => setCustomSubService({ ...customSubService, description: e.target.value })}
                              className="text-sm"
                              />
                            </div>
                          <div>
                            <Button size="sm" onClick={() => stageCustomSubService(service.id)}>
                                <Plus className="w-3 h-3 mr-1" />
                                {t('add')}
                              </Button>
                            </div>
                          </div>

                        {/* Save Pending */}
                        <div className="flex justify-end">
                          <Button size="sm" onClick={() => savePending(service.id)} disabled={(pendingForService.customDrafts.length === 0 && !(pendingForService.selectedSuggested && pendingForService.selectedSuggested.size > 0))}>
                            {t('save')}
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Support & Benefits Section */}
      <Card className="card-gradient slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>{t('support_benefits')}</span>
          </CardTitle>
          <p className="text-muted-foreground">
            {t('support_benefits_desc')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUPPORT_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-xl bg-gradient-to-br from-background/50 to-muted/20 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesSection;