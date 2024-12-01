const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { CATEGORY_COLORS } = require('../config/constants');
const OpenAI = require("openai");

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a title using OpenAI
const generateTitle = async (content) => {
	try {
		if (!content || content.trim() === "") return "Untitled Document";

		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that generates concise and descriptive titles for provided content.",
				},
				{
					role: "user",
					content: `Generate a concise and descriptive title for the following content:\n\n${content} under four words`,
				},
			],
			max_tokens: 4,
		});
		// console.log("Response:", JSON.stringify(response, null, 2));
		// Correctly access the generated title from the nested structure
		let aiGeneratedTitle =
			response.choices?.[0]?.message?.content?.trim() || "Untitled Document";

		// Remove surrounding quotes, if any
		if (aiGeneratedTitle.startsWith('"')) {
			aiGeneratedTitle = aiGeneratedTitle.slice(1);
		}
		return aiGeneratedTitle;
	} catch (error) {
		console.error("Error generating AI title:", error.message);
		return `error: ${error.message}`;
	}
};

const generateCategories = async (content) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: 
                        "You are an expert content analyzer. For the given content, generate EXACTLY THREE distinct categories that capture different aspects:\n" +
                        "1. Main Theme/Topic\n" +
                        "2. Technical/Historical Details\n" +
                        "3. Impact/Applications\n\n" +
                        "Rules:\n" +
                        "- Each category should be 2-3 words\n" +
                        "- Make categories specific to the content\n" +
                        "- No generic terms like 'Key Details' or 'Questions'\n" +
                        "- No numbers or prefixes\n" +
                        "Return exactly three lines, one category per line."
                },
                {
                    role: "user",
                    content: `Generate three specific categories for this content:\n\n${content}`
                }
            ],
            temperature: 0.3,  // Lower temperature for more consistent output
            max_tokens: 50
        });

        const categoryNames = response.choices[0].message.content
            .split('\n')
            .filter(name => name.trim())
            .slice(0, 3);

        return categoryNames.map((name, index) => ({
            name: name.trim(),
            color: [CATEGORY_COLORS.FIRST, CATEGORY_COLORS.SECOND, CATEGORY_COLORS.THIRD][index]
        }));

    } catch (error) {
        console.error("Error generating categories:", error);
        // Return default categories if AI fails
        return [
            { name: "Main Points", color: CATEGORY_COLORS.FIRST },
            { name: "Key Details", color: CATEGORY_COLORS.SECOND },
            { name: "Follow-up", color: CATEGORY_COLORS.THIRD }
        ];
    }
};

const generateHighlights = async (content, categories) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: 
                        "You are an expert content analyzer. Analyze the given text and identify relevant segments for the specified category.\n\n" +
                        "Rules:\n" +
                        "- Find 2-3 relevant text segments\n" +
                        "- Each segment must be an exact match from the content\n" +
                        "- Include the starting and ending character positions\n" +
                        "- Segments should not overlap\n\n" +
                        "Return a JSON object with this exact structure:\n" +
                        '{\n' +
                        '  "categoryHighlights": {\n' +
                        '    "category-id": [\n' +
                        '      {\n' +
                        '        "text": "exact text from content",\n' +
                        '        "startIndex": number,\n' +
                        '        "endIndex": number\n' +
                        '      }\n' +
                        '    ]\n' +
                        '  }\n' +
                        '}'
                },
                {
                    role: "user",
                    content: `Content to analyze: "${content}"\n\nCategory to find highlights for: ${categories[0].name} (ID: ${categories[0].id})`
                }
            ],
            temperature: 0.3,
        });

        let result;
        try {
            result = JSON.parse(response.choices[0].message.content);
        } catch (parseError) {
            console.error("Failed to parse OpenAI response:", response.choices[0].message.content);
            throw new Error("Invalid JSON response from OpenAI");
        }

        // Validate basic structure
        if (!result?.categoryHighlights) {
            console.error("Missing categoryHighlights in response:", result);
            throw new Error("Invalid response structure from OpenAI");
        }

        // Process and validate each highlight
        const validatedHighlights = {};
        
        Object.entries(result.categoryHighlights).forEach(([categoryId, highlights]) => {
            validatedHighlights[categoryId] = highlights.filter(highlight => {
                // Ensure all required fields exist
                if (!highlight?.text || !highlight?.startIndex || !highlight?.endIndex) {
                    console.warn("Skipping highlight with missing fields:", highlight);
                    return false;
                }

                // Find the actual position of this text in the content
                const actualStartIndex = content.indexOf(highlight.text);
                if (actualStartIndex === -1) {
                    console.warn("Text not found in content:", highlight.text);
                    return false;
                }

                // Update indices to actual positions
                highlight.startIndex = actualStartIndex;
                highlight.endIndex = actualStartIndex + highlight.text.length;

                return true;
            });
        });

        return {
            categoryHighlights: validatedHighlights
        };

    } catch (error) {
        console.error("Error in generateHighlights:", error);
        // Return empty highlights structure
        return {
            categoryHighlights: categories.reduce((acc, cat) => {
                acc[cat.id] = [];
                return acc;
            }, {})
        };
    }
};

// Export OpenAI functions
module.exports = {
	generateCategories,
	generateTitle,
	generateHighlights
};
