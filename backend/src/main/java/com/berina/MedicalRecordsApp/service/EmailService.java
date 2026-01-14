package com.berina.MedicalRecordsApp.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email:}")
    private String fromEmail;


    @PostConstruct
    public void debugConfig() {
        System.out.println("====================================");
        System.out.println("SENDGRID CONFIG LOADED:");
        System.out.println("API KEY present: " + (sendGridApiKey != null && !sendGridApiKey.isBlank()));
        System.out.println("FROM EMAIL: " + fromEmail);
        System.out.println("====================================");
    }

    public void sendEmail(String to, String subject, String contentText) {
        System.out.println("=== Sending email to: " + to);
        System.out.println("=== Using FROM email: " + fromEmail);

        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", contentText);
        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            System.out.println("SendGrid status: " + response.getStatusCode());
            System.out.println("SendGrid body: " + response.getBody());

        } catch (Exception e) {
            System.out.println("SendGrid ERROR:");
            e.printStackTrace();
        }
    }
}
