package com.onat.jurist.lawyer.controller;

import com.onat.jurist.lawyer.dto.in.*;
import com.onat.jurist.lawyer.dto.out.MessageResponse;
import com.onat.jurist.lawyer.dto.out.UserResponse;
import com.onat.jurist.lawyer.exception.EmailSendException;
import com.onat.jurist.lawyer.exception.UserNotFoundException;
import com.onat.jurist.lawyer.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    @Value("${app.cookie.same-site:Lax}")
    private String sameSite;

    @PostMapping("/login")
    public ResponseEntity<MessageResponse> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        String token = authService.login(req.email, req.password);

        response.addHeader("Set-Cookie", buildCookieHeader("token", token, 3600));

        return ResponseEntity.ok(new MessageResponse("Login successful"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgot(@RequestBody ForgotPasswordRequest req) {
        try {
            authService.forgotPassword(req.email);
            return ResponseEntity.ok(new MessageResponse("Un lien de réinitialisation a été envoyé à votre email."));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(new MessageResponse(e.getMessage()));
        } catch (EmailSendException e) {
            return ResponseEntity.status(500).body(new MessageResponse(e.getMessage()));
        }
    }



    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> reset(@RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.token, req.newPassword);
        return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @CookieValue(name = "token", required = false) String token,
            @RequestBody ChangePasswordRequest req
    ) {
        if (token == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        authService.changePassword(token, req.oldPassword, req.newPassword);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }


    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletResponse response) {
        response.setHeader("Set-Cookie", buildCookieHeader("token", "", 0));

        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@CookieValue(name = "token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        try {
            UserResponse user = authService.getUserFromToken(token);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).build();
        }
    }

    private String buildCookieHeader(String name, String value, int maxAge) {
        String securePart = secureCookie ? "; Secure" : "";
        return String.format(
                "%s=%s; Max-Age=%d; Path=/; HttpOnly%s; SameSite=%s",
                name,
                value,
                maxAge,
                securePart,
                sameSite
        );
    }

}
