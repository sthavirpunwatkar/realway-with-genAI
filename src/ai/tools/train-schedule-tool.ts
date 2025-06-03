
/**
 * @fileOverview A Genkit tool for fetching train schedules from Firestore.
 *
 * - getTrainScheduleTool - A tool that fetches train schedules for a given crossing ID.
 * - GetTrainScheduleToolInputSchema - Input schema for the tool.
 * - TrainScheduleEntrySchema - Schema for a single train schedule entry.
 * - GetTrainScheduleToolOutputSchema - Output schema for the tool (array of entries).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirestore, collection, query, where, getDocs, Timestamp} from 'firebase/firestore';
import {getFirebaseAuth} from '@/lib/firebase'; // Ensures Firebase app is initialized

export const GetTrainScheduleToolInputSchema = z.object({
  crossingId: z.string().describe('The ID of the railway crossing to fetch schedules for.'),
});

export const TrainScheduleEntrySchema = z.object({
  trainId: z.string().describe('The identifier for the train.'),
  arrivalTime: z.string().describe("The train's scheduled arrival time (e.g., '10:45 AM')."),
  trainType: z.string().describe("The type of train (e.g., 'Express', 'Local')."),
});
export type TrainScheduleEntry = z.infer<typeof TrainScheduleEntrySchema>;

export const GetTrainScheduleToolOutputSchema = z.array(TrainScheduleEntrySchema);

export const getTrainScheduleTool = ai.defineTool(
  {
    name: 'getTrainSchedule',
    description: 'Fetches the upcoming train schedule for a specific railway crossing ID from the database.',
    inputSchema: GetTrainScheduleToolInputSchema,
    outputSchema: GetTrainScheduleToolOutputSchema,
  },
  async (input) => {
    try {
      getFirebaseAuth(); // Ensure Firebase app is initialized
      const db = getFirestore();
      const schedulesRef = collection(db, 'trainSchedules');
      // Simple query by crossingId. For production, you might want to filter by time as well.
      const q = query(schedulesRef, where('crossingId', '==', input.crossingId));
      // Add orderBy('arrivalTime') if arrivalTime is a Firestore Timestamp and you want sorted results.

      const querySnapshot = await getDocs(q);
      const schedules: TrainScheduleEntry[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        schedules.push({
          trainId: data.trainId || 'N/A',
          // Handle Firestore Timestamp if used, otherwise assume string
          arrivalTime: data.arrivalTime instanceof Timestamp
            ? data.arrivalTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            : String(data.arrivalTime || 'N/A'),
          trainType: data.trainType || 'N/A',
        });
      });
      
      if (schedules.length === 0) {
        // Optionally, return a specific message or let the LLM handle the empty array.
        // For example, you could throw an error or return a predefined "no schedule found" structure.
        // Here, we return an empty array, and the LLM can be prompted on how to interpret this.
      }
      return schedules;
    } catch (error) {
      console.error('Error fetching train schedules from Firestore:', error);
      // It's important for the LLM to know if the tool failed.
      // Throwing an error or returning a structured error message helps.
      throw new Error(`Failed to fetch train schedule for crossing ${input.crossingId}.`);
    }
  }
);
