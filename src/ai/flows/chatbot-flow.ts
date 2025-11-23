'use server';
/**
 * @fileOverview A chatbot flow for answering questions about the Blood Bridge app and blood donation.
 *
 * - chat - A function that takes a user's question and returns an AI-generated answer.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { INITIAL_HOSPITALS, INITIAL_CAMPS } from '@/lib/data';

const ChatInputSchema = z.object({
  question: z.string().describe("The user's question."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The chat history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string().describe('The AI-generated answer.');
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatbotFlow(input);
}

const appFeatures = `
- Real-Time Dashboard: Overview of blood inventory levels.
- Send Urgent Requests: Broadcast needs to donors and banks.
- Active Alerts: View and respond to high-priority requests.
- Smart Logistics: Track blood deliveries in real-time.
- AI Supply Forecasting: Predict potential shortages.
- Donation Camps: Find and register for donation camps.
- Donor Database: Manage and contact registered donors.
- Analytics: View trends in requests and donations.
`;

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are an expert AI assistant for the "Blood Bridge" application. Your name is "Pulse".
Your purpose is to answer questions about the application and provide general, helpful information about blood donation.
Be friendly, concise, and helpful. Do not make up information.

Here is some context about the Blood Bridge application:
- App Name: Blood Bridge
- Mission: To connect donors, hospitals, and communities to save lives.
- Key Features:
${appFeatures}

Here is some context about the hospitals and camps in the system:
- Hospitals: ${INITIAL_HOSPITALS.map(h => `${h.name} in ${h.location}`).join(', ')}
- Upcoming Camps: ${INITIAL_CAMPS.map(c => `${c.name} in ${c.location} on ${new Date(c.date).toLocaleDateString()}`).join(', ')}

General Blood Donation Facts (for questions not about the app):
- Common blood types are A, B, AB, and O, each with a positive or negative Rh factor.
- O- is the universal donor for red blood cells. AB+ is the universal recipient.
- A person can typically donate whole blood every 56 days (8 weeks).
- The donation process takes about an hour, but the actual blood draw is only about 10 minutes.
- Donors should be well-hydrated and have eaten a healthy meal before donating.

Chat History:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

User's new question:
{{{question}}}

Your Answer:
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
