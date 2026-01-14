package com.berina.MedicalRecordsApp.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email:}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String contentText) {

        System.out.println("📨 Attempting to send email...");
        System.out.println("From: " + fromEmail);
        System.out.println("To: " + to);

        if (sendGridApiKey == null || sendGridApiKey.isBlank()) {
            System.out.println("❌ SENDGRID_API_KEY is missing!");
            return;
        }

        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);
            Content content = new Content("text/plain", contentText);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            System.out.println("📩 SendGrid status: " + response.getStatusCode());
            System.out.println("📩 SendGrid body: " + response.getBody());
            System.out.println("📩 SendGrid headers: " + response.getHeaders());

        } catch (Exception e) {
            System.out.println("❌ SendGrid exception:");
            e.printStackTrace();
        }
    }
}
