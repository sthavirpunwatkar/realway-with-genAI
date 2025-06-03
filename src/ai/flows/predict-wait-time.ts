
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
import { getTrainScheduleTool } from '@/ai/tools/train-schedule-tool';

const PredictWaitTimeInputSchema = z.object({
  crossingId: z.string().describe('The ID of the railway crossing.'),
  // trainSchedule field removed as it will be fetched by a tool
  historicalTrafficData: z
    .string()
    .describe('Historical traffic data for the specified crossing.'),
  currentDayOfWeek: z
    .string()
    .describe('The current day of the week (e.g., Monday, Tuesday).'),
  currentTimeOfDay: z
    .string()
    .describe('The current time of day (e.g., 10:00 AM, 3:30 PM).'),
});
export type PredictWaitTimeInput = z.infer<typeof PredictWaitTimeInputSchema>;

const PredictWaitTimeOutputSchema = z.object({
  estimatedWaitTime: z
    .string()
    .describe('The estimated wait time at the railway crossing.'),
  explanation: z
    .string()
    .describe('Explanation of the estimated wait time prediction, considering current time, day, and fetched train schedule.'),
});
export type PredictWaitTimeOutput = z.infer<typeof PredictWaitTimeOutputSchema>;

export async function predictWaitTime(input: PredictWaitTimeInput): Promise<PredictWaitTimeOutput> {
  return predictWaitTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictWaitTimePrompt',
  input: {schema: PredictWaitTimeInputSchema},
  output: {schema: PredictWaitTimeOutputSchema},
  tools: [getTrainScheduleTool], // Make the tool available to the LLM
  prompt: `You are an expert in predicting wait times at railway crossings.

  Your task is to analyze the provided historical traffic data, the current day of the week, and the current time of day to determine the estimated wait time for the specified railway crossing.

  To get the train schedule for the crossing, you MUST use the 'getTrainSchedule' tool. Provide the 'crossingId' to this tool. The tool will return a list of upcoming trains, including their arrival times and types. If the tool returns an empty list or an error, mention that no schedule was found or that there was an issue retrieving it, and make your best prediction based on available data.

  In your explanation for the estimated wait time, you should explicitly consider how the current time and day affect typical traffic patterns based on historical data (e.g., "this time of the week is moderately heavy" or "traffic is usually light at this hour on a {{{currentDayOfWeek}}}"). Also, incorporate the fetched train schedule information into your reasoning.

  Railway Crossing ID: {{{crossingId}}}
  Current Day: {{{currentDayOfWeek}}}
  Current Time: {{{currentTimeOfDay}}}
  Historical Traffic Data: {{{historicalTrafficData}}}
  `,
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
