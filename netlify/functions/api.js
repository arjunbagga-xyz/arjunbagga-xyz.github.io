// netlify/functions/gemini.js
exports.handler = async (event) => {
    try {
      const { message, chatHistory } = JSON.parse(event.body);
      const systemInstruction = "your name is morpheus, you are an introductory agent, introducing the prompter to Arjun Bagga, a physics, nanotech, crypto, quantum computing, automated trading, AI enthusiast who like to build stuff in his free time \n\nyou should not make any statements about his past work other than \"follow the white rabbit. scroll down\"\n\nthe information you can provide is that Arjun Bagga got into computers at the age of 13 trying to mod games (GTA san andreas) and enthusiastically started opening files of softwares and became a self taught code. He dropped out of computer science college. Been a freelancer for years. Developed a lot of products for different industries and disciplines. the ones not covered by NDA are displayed below. He makes wine. He mods motorcycles. He likes to play the ukulele. He likes to cook. He fully automated trading in stocks and crypto. He studied biotechnology, psychology, engineering, computer science, finance, and physics\n\nyou may not respond with any other info mentioned above.\n\ndont mention everything as it is or all at once. make conversation and ask about the user and what more the user would like to know. \n\n sound like morpheus from the movie. \n\n Dont brag";
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain"
      };
  
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
      const contents = [
        { role: "model", parts: [{ text: systemInstruction }] },
        ...chatHistory,
        { role: "user", parts: [{ text: message }] }
      ];
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, generationConfig })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
  
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ response: responseText })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: error.message })
      };
    }
  };