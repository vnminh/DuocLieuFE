/**
 * Chatbot API - Placeholder implementations
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: ChatMessage;
  success: boolean;
}

/**
 * Send a text message to the AI chatbot
 * Endpoint: POST /chatbot/message (placeholder)
 */
export async function sendMessage(content: string): Promise<ChatResponse> {
  // Placeholder implementation - simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Placeholder response
  return {
    message: {
      id: Date.now().toString(),
      role: 'assistant',
      content: `This is a placeholder response to: "${content}"`,
      timestamp: new Date(),
    },
    success: true,
  };
}

/**
 * Send a message with an image to the AI chatbot
 * Endpoint: POST /chatbot/message-with-image (placeholder)
 */
export async function sendMessageWithImage(
  content: string,
  image: File
): Promise<ChatResponse> {
  // Placeholder implementation - simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Placeholder response
  return {
    message: {
      id: Date.now().toString(),
      role: 'assistant',
      content: `This is a placeholder response to your message with image "${image.name}": "${content}"`,
      timestamp: new Date(),
    },
    success: true,
  };
}

/**
 * Upload an image for the chatbot
 * Endpoint: POST /chatbot/upload-image (placeholder)
 */
export async function uploadChatImage(
  image: File
): Promise<{ imageUrl: string; success: boolean }> {
  // Placeholder implementation - simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Create a local URL for preview (placeholder)
  const imageUrl = URL.createObjectURL(image);

  return {
    imageUrl,
    success: true,
  };
}
