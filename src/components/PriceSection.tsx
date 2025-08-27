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
  PiggyBank
} from "lucide-react";

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

const currencies = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "CAD", label: "CAD (C$)", symbol: "C$" },
  { value: "AUD", label: "AUD (A$)", symbol: "A$" },
];

const PriceSection = ({ priceData, onUpdate }: PriceSectionProps) => {
  const [newItem, setNewItem] = useState({ description: "", amount: 0 });

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
    <Card className="card-gradient slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <span>Pricing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Price and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price</Label>
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
                className="input-enhanced pl-8"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={priceData.currency} onValueChange={updateCurrency}>
              <SelectTrigger className="input-enhanced">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Price Items */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Additional Items</span>
          </h4>
          
          {/* Add New Item */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="itemDescription">Description</Label>
                <Input
                  id="itemDescription"
                  placeholder="e.g., Additional revisions, Premium support"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="input-enhanced"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemAmount">Amount</Label>
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
                    className="input-enhanced pl-8"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <Button onClick={addPriceItem} className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Price Items List */}
          {priceData.additionalItems.length > 0 && (
            <div className="space-y-3">
              {priceData.additionalItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg border border-border/30">
                  <div className="flex-1">
                    <span className="font-medium">{item.description}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {selectedCurrency.symbol}{formatPrice(item.amount)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removePriceItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Price Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">Total Price</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {selectedCurrency.symbol}{formatPrice(getTotalPrice())}
              </div>
              <div className="text-sm text-muted-foreground">
                {priceData.currency}
              </div>
            </div>
          </div>
        </div>

        {/* Price Notes */}
        <div className="space-y-2">
          <Label htmlFor="priceNotes" className="flex items-center space-x-1">
            <PiggyBank className="w-4 h-4" />
            <span>Additional Notes</span>
          </Label>
          <Textarea
            id="priceNotes"
            placeholder="Payment terms, conditions, or additional pricing information..."
            value={priceData.notes}
            onChange={(e) => updateNotes(e.target.value)}
            className="input-enhanced min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSection;