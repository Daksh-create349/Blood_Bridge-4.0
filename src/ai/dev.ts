import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-optimal-donation-locations.ts';
import '@/ai/flows/forecast-supply-flow.ts';
import '@/ai/flows/chatbot-flow.ts';
