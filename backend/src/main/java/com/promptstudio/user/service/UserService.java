package com.promptstudio.user.service;

import com.promptstudio.user.domain.User;
import com.promptstudio.user.exception.DuplicateUsernameException;
import com.promptstudio.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(String username, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUsernameException(username);
        }
        String passwordHash = passwordEncoder.encode(rawPassword);
        return userRepository.save(User.create(username, passwordHash));
    }
}
