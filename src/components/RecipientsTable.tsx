'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit2, Trash2, Check, X, Users } from 'lucide-react';
import { Recipient } from '@/types';
import { formatAddress, formatAmount } from '@/lib/utils';

interface RecipientsTableProps {
  recipients: Recipient[];
  onUpdateRecipient: (id: string, address: string, amount: string) => void;
  onDeleteRecipient: (id: string) => void;
  isSubmitting?: boolean;
}

export default function RecipientsTable({
  recipients,
  onUpdateRecipient,
  onDeleteRecipient,
  isSubmitting = false,
}: RecipientsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ address: string; amount: string }>({
    address: '',
    amount: '',
  });

  const handleEdit = (recipient: Recipient) => {
    setEditingId(recipient.id);
    setEditData({
      address: recipient.address,
      amount: recipient.amount,
    });
  };

  const handleSave = (id: string) => {
    if (editData.address.trim() && editData.amount.trim()) {
      onUpdateRecipient(id, editData.address.trim(), editData.amount.trim());
      setEditingId(null);
      setEditData({ address: '', amount: '' });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ address: '', amount: '' });
  };

  if (recipients.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto glass-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-orange-500/20 border border-orange-400/30 w-fit">
            <Users className="h-8 w-8 text-orange-400" />
          </div>
          <CardTitle className="text-orange-400">No Recipients Added</CardTitle>
          <CardDescription className="text-gray-300">
            Add recipients using the form above to see them listed here
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto glass-card glow-border">
      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recipients ({recipients.length})
        </CardTitle>
        <CardDescription className="text-gray-300">
          Manage your batch transaction recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-orange-400">Address</TableHead>
                <TableHead className="text-orange-400">Amount (RBTC)</TableHead>
                <TableHead className="text-orange-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.map((recipient) => (
                <TableRow key={recipient.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-sm">
                    {editingId === recipient.id ? (
                      <Input
                        value={editData.address}
                        onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                        className="h-8 text-sm"
                        disabled={isSubmitting}
                      />
                    ) : (
                      <span className="text-white">{formatAddress(recipient.address)}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {editingId === recipient.id ? (
                      <Input
                        value={editData.amount}
                        onChange={(e) => setEditData(prev => ({ ...prev, amount: e.target.value }))}
                        className="h-8 text-sm"
                        type="number"
                        step="0.0001"
                        disabled={isSubmitting}
                      />
                    ) : (
                      <span className="text-white">{formatAmount(recipient.amount)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === recipient.id ? (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSave(recipient.id)}
                          disabled={isSubmitting}
                          className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-400"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(recipient)}
                          disabled={isSubmitting}
                          className="h-8 w-8 p-0 hover:bg-orange-500/20 hover:text-orange-400"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteRecipient(recipient.id)}
                          disabled={isSubmitting}
                          className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

