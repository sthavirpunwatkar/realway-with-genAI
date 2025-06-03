'use server';

/**
 * @fileOverview An AI agent for predicting railway crossing wait times.
 *
 * - predictWaitTime - A function that predicts wait times at railway crossings.
 * - PredictWaitTimeInput - The input type for the predictWaitTime function.
 * - PredictWaitTimeOutput - The return type for the predictWaitTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictWaitTimeInputSchema = z.object({
  crossingId: z.string().describe('The ID of the railway crossing.'),
  trainSchedule: z
    .string()
    .describe('The upcoming train schedule relevant to the crossing.'),
  historicalTrafficData: z
    .string()
    .describe('Historical traffic data for the specified crossing.'),
});
export type PredictWaitTimeInput = z.infer<typeof PredictWaitTimeInputSchema>;

const PredictWaitTimeOutputSchema = z.object({
  estimatedWaitTime: z
    .string()
    .describe('The estimated wait time at the railway crossing.'),
  explanation: z
    .string()
    .describe('Explanation of the estimated wait time prediction.'),
});
export type PredictWaitTimeOutput = z.infer<typeof PredictWaitTimeOutputSchema>;

export async function predictWaitTime(input: PredictWaitTimeInput): Promise<PredictWaitTimeOutput> {
  return predictWaitTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictWaitTimePrompt',
  input: {schema: PredictWaitTimeInputSchema},
  output: {schema: PredictWaitTimeOutputSchema},
  prompt: `You are an expert in predicting wait times at railway crossings.

  Using the provided train schedule and historical traffic data, determine the estimated wait time for the specified railway crossing.
  Explain your reasoning.

  Railway Crossing ID: {{{crossingId}}}
  Train Schedule: {{{trainSchedule}}}
  Historical Traffic Data: {{{historicalTrafficData}}}`,
});

const predictWaitTimeFlow = ai.defineFlow(
  {
    name: 'predictWaitTimeFlow',
    inputSchema: PredictWaitTimeInputSchema,
    outputSchema: PredictWaitTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
