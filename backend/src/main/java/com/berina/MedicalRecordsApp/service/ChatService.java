package com.berina.MedicalRecordsApp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ChatService {

    @Value("${openai.api.key}")
    private String apiKey;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public String askAI(String message) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", new Object[]{
                        Map.of("role", "system", "content", "You are a helpful medical assistant for patients."),
                        Map.of("role", "user", "content", message)
                }
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(OPENAI_URL, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            var choices = (java.util.List<Map<String, Object>>) responseBody.get("choices");
            var messageObj = (Map<String, Object>) choices.get(0).get("message");

            return messageObj.get("content").toString();

        } catch (Exception e) {
            return "AI service unavailable.";
        }
    }
}