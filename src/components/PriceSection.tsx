import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Calculator,
  PiggyBank,
  X
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

interface PriceItem {
  id: string;
  description: string;
  amount: number;
}

interface PriceData {
  basePrice: number;
  currency: string;
  additionalItems: PriceItem[];
  notes: string;
}

interface PriceSectionProps {
  priceData: PriceData;
  onUpdate: (priceData: PriceData) => void;
}

const PriceSection = ({ priceData, onUpdate }: PriceSectionProps) => {
  const [newItem, setNewItem] = useState({ description: "", amount: 0 });
  const { t } = useI18n();

  const currencies = [
    { value: "USD", label: t('usd_label'), symbol: "$" },
    { value: "EUR", label: t('eur_label'), symbol: "€" },
    { value: "GBP", label: t('gbp_label'), symbol: "£" },
    { value: "CAD", label: t('cad_label'), symbol: "C$" },
    { value: "AUD", label: t('aud_label'), symbol: "A$" },
  ];

  const selectedCurrency = currencies.find(c => c.value === priceData.currency) || currencies[0];

  const addPriceItem = () => {
    if (!newItem.description.trim() || newItem.amount <= 0) return;
    
    const item: PriceItem = {
      id: Date.now().toString(),
      description: newItem.description,
      amount: newItem.amount
    };
    
    onUpdate({
      ...priceData,
      additionalItems: [...priceData.additionalItems, item]
    });
    
    setNewItem({ description: "", amount: 0 });
  };

  const removePriceItem = (itemId: string) => {
    onUpdate({
      ...priceData,
      additionalItems: priceData.additionalItems.filter(item => item.id !== itemId)
    });
  };

  const updateBasePrice = (amount: number) => {
    onUpdate({ ...priceData, basePrice: amount });
  };

  const updateCurrency = (currency: string) => {
    onUpdate({ ...priceData, currency });
  };

  const updateNotes = (notes: string) => {
    onUpdate({ ...priceData, notes });
  };

  const getTotalPrice = () => {
    return priceData.basePrice + priceData.additionalItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
            <DollarSign className="w-5 h-5" />
            <span>{t('pricing')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Price and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-center sm:text-left">
              <Label htmlFor="basePrice" className="text-foreground flex items-center justify-center sm:justify-start">{t('base_price')}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  id="basePrice"
                  type="number"
                  placeholder="0.00"
                  value={priceData.basePrice || ""}
                  onChange={(e) => updateBasePrice(parseFloat(e.target.value) || 0)}
                  className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 pl-8 [appearance:textfield]"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <Label htmlFor="currency" className="text-foreground flex items-center justify-center sm:justify-start">{t('currency')}</Label>
              <Select value={priceData.currency} onValueChange={updateCurrency}>
                <SelectTrigger className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-card text-card-foreground border-border">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value} className="hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-200">
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Price Items */}
          <div className="space-y-4">
                     <h4 className="font-medium flex items-center justify-center sm:justify-start space-x-2 text-foreground">
             <Plus className="w-4 h-4 text-primary" />
             <span>{t('additional_items')}</span>
           </h4>
          
          {/* Add New Item */}
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="md:col-span-2 space-y-2 text-center sm:text-left">
                 <Label htmlFor="itemDescription" className="text-foreground flex items-center justify-center sm:justify-start">{t('item_description')}</Label>
                 <Input
                   id="itemDescription"
                   placeholder={t('item_description_placeholder')}
                   value={newItem.description}
                   onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                   className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
                 />
               </div>
               <div className="space-y-2 text-center sm:text-left">
                 <Label htmlFor="itemAmount" className="text-foreground flex items-center justify-center sm:justify-start">{t('amount')}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {selectedCurrency.symbol}
                  </span>
                  <Input
                    id="itemAmount"
                    type="number"
                    placeholder="0.00"
                    value={newItem.amount || ""}
                    onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
                    className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 pl-8 [appearance:textfield]"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
                         <Button onClick={addPriceItem} className="mt-4 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-md rounded-md transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-95 mx-auto">
               <Plus className="w-4 h-4 mr-2" />
               {t('add_item')}
             </Button>
          </div>

          {/* Price Items List */}
          {priceData.additionalItems.length > 0 && (
            <div className="space-y-3">
              {priceData.additionalItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center sm:justify-between p-3 bg-muted/20 rounded-lg border border-border/30"
                >
                  <div className="flex-1 text-center sm:text-left">
                    <span className="font-medium text-foreground">{item.description}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                      {selectedCurrency.symbol}{formatPrice(item.amount)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removePriceItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Total Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
            <div className="flex items-center space-x-2 text-center sm:text-left">
              <Calculator className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg text-foreground">{t('total_price')}</span>
            </div>
            <div className="text-center sm:text-right mt-2 sm:mt-0">
              <div className="text-2xl font-bold text-primary">
                {selectedCurrency.symbol}{formatPrice(getTotalPrice())}
              </div>
              <div className="text-sm text-muted-foreground">
                {priceData.currency}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Price Notes */}
        <div className="space-y-2 text-center sm:text-left">
          <Label htmlFor="priceNotes" className="flex items-center justify-center sm:justify-start space-x-1 text-foreground">
            <PiggyBank className="w-4 h-4 text-muted-foreground" />
            <span>{t('additional_notes')}</span>
          </Label>
          <Textarea
            id="priceNotes"
            placeholder={t('price_notes_placeholder')}
            value={priceData.notes}
            onChange={(e) => updateNotes(e.target.value)}
            className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200 min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default PriceSection;