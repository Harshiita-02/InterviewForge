package com.interviewforge.backend.service.gemini;

import com.interviewforge.backend.entity.InterviewSession;

public class GeminiPromptBuilder {

    public static String buildQuestionPrompt(InterviewSession session, int sequenceNo, String previousAnswerSummary) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are conducting a mock ").append(session.getInterviewType()).append(" interview ")
                .append("for the role of ").append(session.getRole()).append(". ")
                .append("Current difficulty level: ").append(session.getDifficulty()).append(". ");

        if (session.getTopics() != null && !session.getTopics().isEmpty()) {
            prompt.append("Focus on these topics: ");
            session.getTopics().forEach(topic -> prompt.append(topic.getName()).append(", "));
        }

        if (previousAnswerSummary != null) {
            prompt.append("The candidate's previous answer: ").append(previousAnswerSummary).append(". ")
                    .append("Adjust the next question's difficulty based on how well they answered. ");
        }

        prompt.append("This is question number ").append(sequenceNo).append(" in the interview. ")
                .append("Return ONLY the interview question text, with no preamble, numbering, or extra commentary.");

        return prompt.toString();
    }

    public static String buildEvaluationPrompt(String questionText, String answerText) {
        return """
            You are evaluating a candidate's interview answer.

            Question: %s
            Candidate's answer: %s

            Return your evaluation strictly as JSON in this exact format, with no other text:
            {"score": <number 0-100>, "feedback": "<2-3 sentence constructive feedback>"}
            """.formatted(questionText, answerText);
    }
}