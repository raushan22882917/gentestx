const path = require('path');

// Try to load vscode module, but don't fail if it's not available
let vscode;
try {
    vscode = require('vscode');
} catch (error) {
    // Running outside of VSCode
    vscode = null;
}

/**
 * Generates test code based on the analysis from Groq
 * @param {string} analysisResult - The analysis result from Groq API
 * @param {string} sourceCode - The original source code
 * @param {string} language - The programming language
 * @returns {Promise<string>} - The generated test code
 */
async function generateTests(analysisResult, sourceCode, language) {
    let testFramework = 'jest'; // Default framework

    // If running inside VSCode, try to get framework from settings
    if (vscode) {
        const config = vscode.workspace.getConfiguration('gentestx');
        const configFramework = config.get('testFramework');
        if (configFramework) {
            testFramework = configFramework;
        }
    }

    if (testFramework === 'auto') {
        // Auto-detect test framework based on language
        testFramework = getDefaultTestFramework(language);
    }

    // Extract test cases from the analysis result
    let testCases = extractTestCases(analysisResult);

    // Generate test code based on the language and test framework
    return generateTestCode(testCases, sourceCode, language, testFramework);
}

/**
 * Extracts test cases from the Groq API analysis result
 * @param {string} analysisResult - The analysis result from Groq API
 * @returns {Array} - Array of test cases
 */
function extractTestCases(analysisResult) {
    try {
        // Try to find and parse JSON in the analysis result
        const jsonMatch = analysisResult.match(/```json([\s\S]*?)```/) ||
                         analysisResult.match(/{[\s\S]*"testCases"[\s\S]*}/);

        if (jsonMatch) {
            const jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
            const testData = JSON.parse(jsonStr);
            return testData.testCases || [];
        }

        // If no JSON found, try to extract structured data from the text
        const testCases = [];
        const testCaseMatches = analysisResult.matchAll(/Test Case \d+:[\s\S]*?(?=Test Case \d+:|$)/g);

        for (const match of testCaseMatches) {
            const testCaseText = match[0];
            const description = (testCaseText.match(/Description:[\s\S]*?(?=Function:|Input:|$)/i) || [''])[0].replace(/Description:/i, '').trim();
            const functionToTest = (testCaseText.match(/Function:[\s\S]*?(?=Input:|Expected:|$)/i) || [''])[0].replace(/Function:/i, '').trim();
            const inputs = (testCaseText.match(/Input:[\s\S]*?(?=Expected:|Scenario:|$)/i) || [''])[0].replace(/Input:/i, '').trim();
            const expectedOutput = (testCaseText.match(/Expected:[\s\S]*?(?=Scenario:|$)/i) || [''])[0].replace(/Expected:/i, '').trim();
            const scenario = (testCaseText.match(/Scenario:[\s\S]*?(?=$)/i) || [''])[0].replace(/Scenario:/i, '').trim();

            testCases.push({
                description,
                functionToTest,
                inputs,
                expectedOutput,
                scenario
            });
        }

        return testCases.length > 0 ? testCases : parseUnstructuredAnalysis(analysisResult);
    } catch (error) {
        console.error('Error extracting test cases:', error);
        return parseUnstructuredAnalysis(analysisResult);
    }
}

/**
 * Fallback method to parse unstructured analysis text
 * @param {string} analysisResult - The analysis result from Groq API
 * @returns {Array} - Array of test cases
 */
function parseUnstructuredAnalysis(analysisResult) {
    // As a fallback, ask Groq to generate test code directly
    return [];
}

/**
 * Gets the default test framework for a language
 * @param {string} language - The programming language
 * @returns {string} - The default test framework
 */
function getDefaultTestFramework(language) {
    switch (language) {
        case 'javascript':
        case 'typescript':
            return 'jest';
        case 'python':
            return 'pytest';
        case 'java':
            return 'junit';
        default:
            return 'jest';
    }
}

/**
 * Generates test code based on test cases, language, and framework
 * @param {Array} testCases - Array of test cases
 * @param {string} sourceCode - The original source code
 * @param {string} language - The programming language
 * @param {string} framework - The test framework
 * @returns {string} - The generated test code
 */
async function generateTestCode(testCases, sourceCode, language, framework) {
    let apiKey = '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';

    // If running inside VSCode, try to get API key from settings
    if (vscode) {
        const config = vscode.workspace.getConfiguration('gentestx');
        const configApiKey = config.get('groqApiKey');
        if (configApiKey) {
            apiKey = configApiKey;
        }
    }

    const axios = require('axios');

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: `You are a test code generation expert. Generate comprehensive test code for the provided source code using the ${framework} testing framework for ${language}.`
                    },
                    {
                        role: 'user',
                        content: `Generate comprehensive test code for the following ${language} code using the ${framework} testing framework.

                        Source code:
                        \`\`\`${language}
                        ${sourceCode}
                        \`\`\`

                        ${testCases.length > 0 ? `Based on the analysis, here are the test cases to implement:
                        ${JSON.stringify(testCases, null, 2)}` : 'Generate all possible test cases covering normal scenarios, edge cases, and error handling.'}

                        Please provide only the complete, ready-to-use test code without explanations. Make sure to:
                        1. Include all necessary imports
                        2. Create proper test setup and teardown if needed
                        3. Implement all test cases with clear assertions
                        4. Follow best practices for ${framework}
                        5. Include comments explaining each test case
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

        let testCode = response.data.choices[0].message.content;

        // Clean up the response to extract just the code
        testCode = testCode.replace(/```[a-z]*\n/g, '').replace(/```$/g, '');

        return testCode;
    } catch (error) {
        console.error('Error generating test code:', error.response?.data || error.message);
        throw new Error(`Failed to generate test code: ${error.response?.data?.error?.message || error.message}`);
    }
}

module.exports = {
    generateTests,
    extractTestCases
};
