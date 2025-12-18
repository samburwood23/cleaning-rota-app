export interface TaskDescriptionResult {
  description: string;
  tips: string[];
}

/**
 * Generate a detailed cleaning task description using Hugging Face AI
 * Calls a secure serverless function to keep API keys safe
 * @param taskName - The name of the cleaning task
 * @param currentDescription - Optional current description for context
 * @returns Promise with generated description and tips
 */
export async function generateTaskDescription(
  taskName: string,
  currentDescription?: string
): Promise<TaskDescriptionResult> {
  try {
    // Call our serverless function instead of calling Hugging Face directly
    // This keeps the API key secure on the backend
    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskName,
        currentDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result: TaskDescriptionResult = await response.json();
    return result;
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

