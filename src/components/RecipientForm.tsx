'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Wallet, Coins } from 'lucide-react';
import { isValidEthereumAddress, formatAmount } from '@/lib/utils';
import { FormData } from '@/types';

interface RecipientFormProps {
  onAddRecipient: (recipient: { address: string; amount: string }) => void;
  isSubmitting?: boolean;
}

export default function RecipientForm({ onAddRecipient, isSubmitting = false }: RecipientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    amount: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (!isValidEthereumAddress(formData.address)) {
      newErrors.address = 'Invalid Ethereum address';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddRecipient({
        address: formData.address.trim(),
        amount: formatAmount(formData.amount),
      });

      // Reset form
      setFormData({ address: '', amount: '' });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full glass-card glow-border">
      <CardHeader>
        <CardTitle className="glow-text flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Recipient
        </CardTitle>
        <CardDescription className="text-gray-300">
          Enter recipient address and amount to add to batch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-orange-400 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Recipient Address
            </label>
            <Input
              id="address"
              type="text"
              placeholder="0x..."
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={errors.address ? 'border-red-400/50 focus:border-red-400/50' : ''}
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="text-sm text-red-400">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-orange-400 flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Amount (ETH)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              placeholder="0.0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={errors.amount ? 'border-red-400/50 focus:border-red-400/50' : ''}
              disabled={isSubmitting}
            />
            {errors.amount && (
              <p className="text-sm text-red-400">{errors.amount}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full glass-button hover-lift hover-glow"
            disabled={isSubmitting}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Adding...' : 'Add Recipient'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

