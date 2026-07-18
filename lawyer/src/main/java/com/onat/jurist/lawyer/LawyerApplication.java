package com.onat.jurist.lawyer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LawyerApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        setSystemPropertyIfPresent("MAIL_USERNAME", dotenv);
        setSystemPropertyIfPresent("MAIL_PASSWORD", dotenv);

        SpringApplication.run(LawyerApplication.class, args);

    }

    private static void setSystemPropertyIfPresent(String key, Dotenv dotenv) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) {
            value = dotenv.get(key);
        }
        if (value != null && !value.isBlank()) {
            System.setProperty(key, value);
        }
    }

}
