'use server';
/**
 * @fileOverview Analyzes blood supply inventory to forecast shortage risks.
 *
 * - forecastSupply - A function that predicts shortage risk for a given blood type.
 * - ForecastSupplyInput - The input type for the forecastSupply function
 * - ForecastSupplyOutput - The return type for the forecastSupply function
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {BloodInventory} from '@/lib/types';

const ForecastSupplyInputSchema = z.object({
  bloodType: z.string().describe('The blood type to forecast.'),
  inventory: z.array(
    z.object({
      id: z.string(),
      bloodType: z.string(),
      quantity: z.number(),
      hospitalId: z.string(),
      status: z.string(),
    })
  ).describe('The current blood inventory levels.'),
});
export type ForecastSupplyInput = z.infer<typeof ForecastSupplyInputSchema>;

const ForecastSupplyOutputSchema = z.object({
  shortageRisk: z.enum(['Low', 'Medium', 'High']).describe('The predicted shortage risk.'),
  reason: z.string().describe('The reasoning behind the forecast.'),
});
export type ForecastSupplyOutput = z.infer<typeof ForecastSupplyOutputSchema>;

export async function forecastSupply(
  input: ForecastSupplyInput
): Promise<ForecastSupplyOutput> {
  return forecastSupplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastSupplyPrompt',
  input: {schema: ForecastSupplyInputSchema},
  output: {schema: ForecastSupplyOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are a blood supply chain analyst AI. Your task is to predict the shortage risk for a specific blood type based on current inventory data.

  Analyze the provided inventory for the requested blood type: {{{bloodType}}}.

  - Total units available across all hospitals.
  - Number of hospitals with 'Critical' or 'Low' status for this blood type.
  - Overall distribution of this blood type.

  Based on your analysis, determine if the shortage risk is 'Low', 'Medium', or 'High' and provide a concise reason for your conclusion.

  - High Risk: Very few units available, multiple critical statuses.
  - Medium Risk: Limited units, some 'Low' statuses, or concentration in few locations.
  - Low Risk: Ample supply, good distribution, mostly 'Available' status.

  Current Inventory for {{{bloodType}}}:
  {{#each inventory}}
  - Hospital ID: {{hospitalId}}, Quantity: {{quantity}}, Status: {{status}}
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
    // Filter inventory for the relevant blood type to pass to the prompt
    const relevantInventory = input.inventory.filter(item => item.bloodType === input.bloodType);
    
    const {output} = await prompt({
        bloodType: input.bloodType,
        inventory: relevantInventory,
    });
    return output!;
  }
);
