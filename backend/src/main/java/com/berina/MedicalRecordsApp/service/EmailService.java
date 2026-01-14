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
        if (sendGridApiKey == null || sendGridApiKey.isBlank()) {
            System.out.println("⚠ SendGrid API key not configured. Skipping email.");
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
            sg.api(request);

            System.out.println("✅ Email sent to " + to);

        } catch (Exception e) {
            System.out.println("⚠ Email failed but app continues: " + e.getMessage());
        }
    }
}
