'use server';
/**
 * @fileOverview Analyzes blood supply inventory to forecast shortage risks.
 *
 * - forecastSupply - A function that predicts shortage risk for a given blood type.
 * - ForecastSupplyInput - The input type for the forecastSupply function.
 * - ForecastSupplyOutput - The return type for the forecastSupply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { BloodInventory } from '@/lib/types';

const ForecastSupplyInputSchema = z.object({
  bloodType: z.string().describe('The blood type to be analyzed (e.g., A+, O-).'),
  inventory: z.array(
    z.object({
      id: z.string(),
      bloodType: z.string(),
      quantity: z.number(),
      hospitalId: z.string(),
      status: z.string(),
    })
  ).describe('A list of all current blood inventory items.'),
});
export type ForecastSupplyInput = z.infer<typeof ForecastSupplyInputSchema>;

const ForecastSupplyOutputSchema = z.object({
  shortageRisk: z.enum(['Low', 'Medium', 'High']).describe('The predicted risk of a shortage for the given blood type.'),
  reason: z.string().describe('A detailed explanation for the predicted risk level, including factors considered.'),
});
export type ForecastSupplyOutput = z.infer<typeof ForecastSupplyOutputSchema>;

export async function forecastSupply(input: ForecastSupplyInput): Promise<ForecastSupplyOutput> {
  return forecastSupplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastSupplyPrompt',
  input: {schema: ForecastSupplyInputSchema},
  output: {schema: ForecastSupplyOutputSchema},
  prompt: `You are an expert supply chain analyst for a network of blood banks. Your task is to forecast the shortage risk for a specific blood type based on the current inventory data.

Analyze the inventory for blood type: {{{bloodType}}}

Consider the following factors from the inventory data provided:
1.  **Total Quantity:** The total number of units available for the specified blood type across all hospitals.
2.  **Inventory Status:** The number of inventory items marked as 'Critical' or 'Low'. A high number of these indicates increased risk.
3.  **Distribution:** How many different hospitals have this blood type in stock. Poor distribution can be a risk factor.

Based on your analysis, determine if the shortage risk is 'Low', 'Medium', or 'High' and provide a clear, concise reason for your conclusion.

Current Inventory Data:
{{#each inventory}}
- ID: {{id}}, Blood Type: {{bloodType}}, Quantity: {{quantity}}, Status: {{status}}, HospitalID: {{hospitalId}}
{{/each}}
`,
});

const forecastSupplyFlow = ai.defineFlow(
  {
    name: 'forecastSupplyFlow',
    inputSchema: ForecastSupplyInputSchema,
    outputSchema: ForecastSupplyOutputSchema,
  },
  async input => {
    // Filter inventory for the relevant blood type to pass to the model
    const relevantInventory = input.inventory.filter(item => item.bloodType === input.bloodType);
    
    const {output} = await prompt({
        bloodType: input.bloodType,
        inventory: relevantInventory,
    });
    return output!;
  }
);
