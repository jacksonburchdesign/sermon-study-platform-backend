// backend/src/api/sermon/content-types/sermon/lifecycles.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = {
  async afterCreate(event) {
    await processAiChapters(event);
  },
  
  async afterUpdate(event) {
    await processAiChapters(event);
  }
};

function extractTextFromBlocks(transcriptData) {
  if (typeof transcriptData === 'string') return transcriptData;
  if (Array.isArray(transcriptData)) {
    return transcriptData.map(block => {
      if (block.children) {
        return block.children.map(child => child.text).join(' ');
      }
      return '';
    }).join('\n\n');
  }
  return '';
}

async function processAiChapters(event) {
  const { result } = event;

  const sermon = await strapi.entityService.findOne('api::sermon.sermon', result.id, {
    populate: ['Chapters']
  });

  if (!sermon.Transcript) return;
  if (sermon.Chapters && sermon.Chapters.length > 0) return;

  const plainTextTranscript = extractTextFromBlocks(sermon.Transcript);

  if (!plainTextTranscript || plainTextTranscript.trim() === '') return;

  console.log("🚀 Triggering Gemini AI...");

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert theological assistant. Analyze the following sermon transcript.
      Divide the sermon into logical chapters or segments.
      
      Return a strict JSON array of objects. 
      Each object must have exactly these four keys:
      - "StartTime": A string estimating the video timestamp (e.g., "00:00", "05:24").
      - "Title": A short, engaging title for this section.
      - "Summary": A 2-3 sentence summary of the key theological points.
      - "Scriptures": A string listing relevant Bible references mentioned (e.g., "John 3:16").

      Transcript to analyze:
      ${plainTextTranscript}
    `;

    const aiResult = await model.generateContent(prompt);
    const rawChaptersArray = JSON.parse(aiResult.response.text());
    
    // NEW: Wrap the plain text summary in Strapi's required Blocks format
    const formattedChapters = rawChaptersArray.map(chapter => {
      return {
        ...chapter,
        Summary: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: chapter.Summary || '' }]
          }
        ]
      };
    });

    console.log("✅ AI JSON Parsed and Formatted! Updating the database...");

    await strapi.entityService.update('api::sermon.sermon', result.id, {
      data: {
        Chapters: formattedChapters
      }
    });

    console.log("🎉 Successfully saved AI Chapters with Summaries!");

  } catch (error) {
    console.error("🔴 AI Generation or Save failed:", error);
  }
}