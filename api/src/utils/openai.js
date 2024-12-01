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

// Export OpenAI functions
module.exports = {
	generateCategories,
	generateTitle
};
