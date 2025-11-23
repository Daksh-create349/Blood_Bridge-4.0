'use server';

/**
 * @fileOverview Suggests optimal donation locations based on blood type and urgency.
 *
 * - suggestOptimalDonationLocations - A function that suggests the best donation locations.
 * - SuggestOptimalDonationLocationsInput - The input type for the suggestOptimalDonationLocations function.
 * - SuggestOptimalDonationLocationsOutput - The return type for the suggestOptimalDonationLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalDonationLocationsInputSchema = z.object({
  donorBloodType: z.string().describe('The blood type of the donor (e.g., A+, O-).'),
  activeRequests: z.array(
    z.object({
      hospitalName: z.string().describe('The name of the hospital making the request.'),
      hospitalLocation: z.string().describe('The location of the hospital.'),
      bloodTypeNeeded: z.string().describe('The blood type needed by the hospital.'),
      quantityRequested: z.number().describe('The quantity of blood units requested.'),
      urgency: z.enum(['Critical', 'High', 'Moderate']).describe('The urgency level of the request.'),
    })
  ).describe('A list of active blood requests from various hospitals.'),
});
export type SuggestOptimalDonationLocationsInput = z.infer<
  typeof SuggestOptimalDonationLocationsInputSchema
>;

const SuggestOptimalDonationLocationsOutputSchema = z.array(
  z.object({
    hospitalName: z.string().describe('The name of the hospital.'),
    hospitalLocation: z.string().describe('The location of the hospital.'),
    priorityScore: z.number().describe('A score indicating the priority of donating to this hospital (higher is better).'),
    reason: z.string().describe('Explanation of why this hospital is prioritized for the user.'),
  })
);
export type SuggestOptimalDonationLocationsOutput = z.infer<
  typeof SuggestOptimalDonationLocationsOutputSchema
>;

export async function suggestOptimalDonationLocations(
  input: SuggestOptimalDonationLocationsInput
): Promise<SuggestOptimalDonationLocationsOutput> {
  return suggestOptimalDonationLocationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalDonationLocationsPrompt',
  input: {schema: SuggestOptimalDonationLocationsInputSchema},
  output: {schema: SuggestOptimalDonationLocationsOutputSchema},
  model: 'googleai/gemini-1.5-flash-preview',
  prompt: `You are an AI assistant designed to help blood donors find the optimal location to donate blood.

  Given the donor's blood type and a list of active blood requests from hospitals, your goal is to rank the hospitals based on donation priority.

  Prioritize hospitals that:
  1.  Need the donor's blood type.
  2.  Have a higher urgency level (Critical > High > Moderate).
  3.  Have a larger quantity requested.

  Provide a priority score and a reason for each hospital in the output.

  Donor Blood Type: {{{donorBloodType}}}
  Active Requests:{{#each activeRequests}}\n
  - Hospital: {{hospitalName}}, Location: {{hospitalLocation}}, Blood Type Needed: {{bloodTypeNeeded}}, Quantity: {{quantityRequested}}, Urgency: {{urgency}}{{/each}}
  \n
  Prioritized Hospitals:`,
});

const suggestOptimalDonationLocationsFlow = ai.defineFlow(
  {
    name: 'suggestOptimalDonationLocationsFlow',
    inputSchema: SuggestOptimalDonationLocationsInputSchema,
    outputSchema: SuggestOptimalDonationLocationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
