import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Construction } from 'lucide-react';

export function AlertSettingsPanel() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bell /> Customizable Alerts
        </CardTitle>
        <CardDescription>
          Configure your preferences for railway gate notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <Construction className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">Feature Coming Soon!</h3>
        <p className="text-muted-foreground">
          We're working hard to bring you customizable alerts for gate closures and openings.
          Stay tuned for updates!
        </p>
      </CardContent>
    </Card>
  );
}
