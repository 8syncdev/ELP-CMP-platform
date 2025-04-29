import { ChatAIClient } from './chat-ai';

export default async function page() {

  // Lấy giá trị từ .env
  // const expireDate = process.env.NORMAL_EXPIRE;
  const expireDate = "YOUR_EXPIRE";
  const apiKey = "YOUR_API_KEY";

  return <ChatAIClient
    expiresIn={expireDate}
    apiKey={apiKey}
    initialPolicy='trial'
  />;
} 