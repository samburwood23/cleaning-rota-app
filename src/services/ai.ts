import { HfInference } from '@huggingface/inference';

// Note: For production use, you should store the API key in environment variables
// and use a backend service to keep it secure. This is a demo implementation.
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || '';

const hf = new HfInference(HF_API_KEY);

export interface TaskDescriptionResult {
  description: string;
  tips: string[];
}

/**
 * Generate a detailed cleaning task description using Hugging Face AI
 * @param taskName - The name of the cleaning task
 * @param currentDescription - Optional current description for context
 * @returns Promise with generated description and tips
 */
export async function generateTaskDescription(
  taskName: string,
  currentDescription?: string
): Promise<TaskDescriptionResult> {
  try {
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

    // Use Hugging Face's text generation model
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

    // Parse the response
    const parsed = parseAIResponse(generatedText);

    return parsed;
  } catch (error) {
    console.error('Error generating task description:', error);

    // Fallback to a simple generated description
    return {
      description: `Complete the ${taskName} task thoroughly and efficiently.`,
      tips: [
        'Start from top to bottom to avoid re-cleaning',
        'Use appropriate cleaning products for the surfaces',
        'Set aside enough time to do a thorough job',
      ],
    };
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
      .slice(0, 5); // Limit to 5 tips
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

/**
 * Generate quick task suggestions based on a partial input
 * @param partialInput - Partial task name or description
 * @returns Array of suggested task names
 */
export async function suggestTasks(partialInput: string): Promise<string[]> {
  try {
    const prompt = `List 5 common household cleaning tasks that match or relate to: "${partialInput}".
Only provide the task names, one per line, no numbers or bullets.`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    const suggestions = response.generated_text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length < 50)
      .slice(0, 5);

    return suggestions;
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return [];
  }
}
