import type { VercelRequest, VercelResponse } from '@vercel/node';
import { HfInference } from '@huggingface/inference';

interface RequestBody {
  taskName: string;
  currentDescription?: string;
}

interface TaskDescriptionResult {
  description: string;
  tips: string[];
}

/**
 * Vercel Serverless Function for generating task descriptions
 * This keeps the API key secure on the backend
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment variables (server-side only)
  const HF_API_KEY = process.env.HF_API_KEY;

  if (!HF_API_KEY) {
    console.error('HF_API_KEY is not configured');
    return res.status(500).json({
      error: 'AI service not configured. Please contact the administrator.'
    });
  }

  const { taskName, currentDescription } = req.body as RequestBody;

  if (!taskName || typeof taskName !== 'string') {
    return res.status(400).json({ error: 'Task name is required' });
  }

  try {
    const hf = new HfInference(HF_API_KEY);

    const prompt = `You are a helpful cleaning and household management assistant. Generate a detailed, practical description for the following cleaning task.

Task Name: ${taskName}
${currentDescription ? `Current Description: ${currentDescription}` : ''}

Provide:
1. A clear, concise description (2-3 sentences) of what this cleaning task involves
2. 3-5 practical tips for completing this task effectively

Format your response as:
DESCRIPTION: [your description here]
TIPS:
- [tip 1]
- [tip 2]
- [tip 3]

Keep it practical and helpful for household cleaning.`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    const generatedText = response.generated_text;
    const parsed = parseAIResponse(generatedText);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error generating task description:', error);

    // Return fallback response
    return res.status(200).json({
      description: `Complete the ${taskName} task thoroughly and efficiently.`,
      tips: [
        'Start from top to bottom to avoid re-cleaning',
        'Use appropriate cleaning products for the surfaces',
        'Set aside enough time to do a thorough job',
      ],
    });
  }
}

/**
 * Parse the AI-generated response into structured data
 */
function parseAIResponse(text: string): TaskDescriptionResult {
  const descriptionMatch = text.match(/DESCRIPTION:\s*(.+?)(?=TIPS:|$)/is);
  const tipsMatch = text.match(/TIPS:\s*([\s\S]+)/i);

  let description = 'Complete this cleaning task thoroughly and efficiently.';
  let tips: string[] = [];

  if (descriptionMatch && descriptionMatch[1]) {
    description = descriptionMatch[1].trim();
  }

  if (tipsMatch && tipsMatch[1]) {
    tips = tipsMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.match(/^\d+\./))
      .map(line => line.replace(/^[-\d.]\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  }

  // Fallback tips if none were parsed
  if (tips.length === 0) {
    tips = [
      'Start from top to bottom to avoid re-cleaning',
      'Use appropriate cleaning products',
      'Set aside enough time to do a thorough job',
    ];
  }

  return { description, tips };
}
