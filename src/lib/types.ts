export interface Experiment {
  id: string;
  name: string;
  fileContent: string;
  analysis: string;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
