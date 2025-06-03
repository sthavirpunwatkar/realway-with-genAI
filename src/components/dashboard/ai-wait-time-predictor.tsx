"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictWaitTime, type PredictWaitTimeInput, type PredictWaitTimeOutput } from '@/ai/flows/predict-wait-time';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  crossingId: z.string().min(1, "Crossing ID is required"),
  trainSchedule: z.string().min(1, "Train schedule is required"),
  historicalTrafficData: z.string().min(1, "Historical traffic data is required"),
});

type FormData = z.infer<typeof formSchema>;

export function AiWaitTimePredictor() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictWaitTimeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crossingId: "",
      trainSchedule: "",
      historicalTrafficData: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setPredictionResult(null);
    setError(null);
    try {
      const result = await predictWaitTime(data as PredictWaitTimeInput);
      setPredictionResult(result);
      toast({
        title: "Prediction Successful",
        description: `Estimated wait time for ${data.crossingId} generated.`,
        variant: "default",
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Prediction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">AI Wait Time Predictor</CardTitle>
        <CardDescription>
          Enter railway crossing details to get an AI-powered wait time estimation.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="crossingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Railway Crossing ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., RC123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trainSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train Schedule</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter upcoming train schedule (e.g., 'Express train at 10:30 AM, Local at 11:15 AM')" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalTrafficData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Traffic Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe historical traffic patterns (e.g., 'Heavy traffic on weekday mornings, light on weekends')" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Wait Time"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {predictionResult && (
        <Card className="mt-6 bg-accent/20">
          <CardHeader>
            <CardTitle className="font-headline text-accent-foreground">Prediction Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Estimated Wait Time:</strong> {predictionResult.estimatedWaitTime}</p>
            <p><strong>Explanation:</strong> {predictionResult.explanation}</p>
          </CardContent>
        </Card>
      )}
      {error && (
         <Card className="mt-6 bg-destructive/20">
          <CardHeader>
            <CardTitle className="font-headline text-destructive-foreground flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Prediction Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}
    </Card>
  );
}
