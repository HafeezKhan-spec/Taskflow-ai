const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

/**
 * @desc    Process raw content from external sources using AI (Google Gemini)
 * @param   {String} text - Raw text from email, transcript, or CRM
 * @param   {String} source - Source of the content (Outlook, Salesforce, Monday)
 * @returns {Object} Structured task data
 */
exports.processRawContent = async (text, source) => {
  try {
    const prompt = `You are an AI task extraction assistant for TaskFlow AI. 
    Analyze the provided text and extract actionable tasks. 
    Return a valid JSON object with the following schema:
    {
      "tasks": [
        {
          "title": "Concise task title",
          "description": "Clear description of action required",
          "owner_email": "email of responsible person or null",
          "dueDate": "YYYY-MM-DD format, infer from text using ${new Date().toISOString().split('T')[0]} as reference",
          "priority": "Low", "Medium", or "High"
        }
      ]
    }
    
    Source of content: ${source}
    Text to analyze: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResult = response.text();
    
    const parsedData = JSON.parse(textResult);
    return parsedData.tasks || [];
  } catch (error) {
    console.error('Gemini AI Processing Error:', error);
    throw new Error('Failed to process content with Gemini AI');
  }
};
