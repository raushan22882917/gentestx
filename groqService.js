const axios = require('axios');

// Try to load vscode module, but don't fail if it's not available
let vscode;
try {
    vscode = require('vscode');
} catch (error) {
    // Running outside of VSCode
    vscode = null;
}

/**
 * Analyzes code using the Groq API
 * @param {string} code - The source code to analyze
 * @param {string} language - The programming language of the code
 * @returns {Promise<object>} - The analysis result from Groq
 */
async function analyzeCodeWithGroq(code, language) {
    let apiKey = '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';

    // If running inside VSCode, try to get API key from settings
    if (vscode) {
        const config = vscode.workspace.getConfiguration('gentestx');
        const configApiKey = config.get('groqApiKey');
        if (configApiKey) {
            apiKey = configApiKey;
        }
    }

    if (!apiKey) {
        throw new Error('Groq API key is not configured. Please set it in the extension settings.');
    }

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: `You are a code analysis expert that specializes in generating comprehensive test cases.
                        Analyze the provided ${language} code and identify all possible test scenarios.`
                    },
                    {
                        role: 'user',
                        content: `Please analyze the following ${language} code and provide a detailed analysis of its functionality,
                        edge cases, and potential bugs. Then, generate comprehensive test cases that cover all possible scenarios.

                        Here's the code:

                        \`\`\`${language}
                        ${code}
                        \`\`\`

                        For your response, please provide:
                        1. A brief analysis of what the code does
                        2. Identification of key functions, classes, and methods
                        3. Potential edge cases and error scenarios
                        4. A comprehensive list of test cases in JSON format with the following structure:
                           {
                             "testCases": [
                               {
                                 "description": "Test case description",
                                 "functionToTest": "functionName",
                                 "inputs": [input values or description],
                                 "expectedOutput": expected result,
                                 "scenario": "normal/edge case/error handling"
                               }
                             ]
                           }
                        `
                    }
                ],
                temperature: 0.2,
                max_tokens: 4000
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling Groq API:', error.response?.data || error.message);
        throw new Error(`Failed to analyze code with Groq: ${error.response?.data?.error?.message || error.message}`);
    }
}

module.exports = {
    analyzeCodeWithGroq
};
