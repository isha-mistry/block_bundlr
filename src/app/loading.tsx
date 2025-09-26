import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto glass-card glow-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-orange-500/20 border border-orange-400/30 w-fit">
            <Loader2 className="h-8 w-8 text-orange-400 animate-spin" />
          </div>
          <CardTitle className="glow-text">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-300">
            Please wait while we load your data
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

