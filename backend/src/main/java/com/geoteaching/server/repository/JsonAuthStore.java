package com.geoteaching.server.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geoteaching.server.config.AuthProperties;
import com.geoteaching.server.model.AuthStoreData;
import com.geoteaching.server.model.StoredUser;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("!mysql")
public class JsonAuthStore implements UserStore {

    private final ObjectMapper objectMapper;
    private final Path dataFilePath;

    public JsonAuthStore(AuthProperties authProperties, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper.copy().findAndRegisterModules();
        this.dataFilePath = Path.of(authProperties.dataFilePath()).normalize();
    }

    public synchronized Optional<StoredUser> findUserByAccount(String account) {
        return readData().getUsers().stream()
                .filter(user -> user.account().equals(account))
                .findFirst();
    }

    public synchronized void saveUser(StoredUser user) {
        AuthStoreData data = readData();
        List<StoredUser> users = new ArrayList<>(data.getUsers());
        users.add(0, user);
        data.setUsers(users);
        writeData(data);
    }

    public synchronized void updateLastLogin(String account, Instant lastLoginAt) {
        AuthStoreData data = readData();
        List<StoredUser> users = new ArrayList<>();

        for (StoredUser user : data.getUsers()) {
            if (user.account().equals(account)) {
                users.add(new StoredUser(
                        user.id(),
                        user.account(),
                        user.channel(),
                        user.role(),
                        user.displayName(),
                        user.passwordHash(),
                        user.passwordSalt(),
                        user.createdAt(),
                        lastLoginAt));
            } else {
                users.add(user);
            }
        }

        data.setUsers(users);
        writeData(data);
    }

    public synchronized void updateDisplayName(String account, String displayName) {
        AuthStoreData data = readData();
        List<StoredUser> users = new ArrayList<>();

        for (StoredUser user : data.getUsers()) {
            if (user.account().equals(account)) {
                users.add(new StoredUser(
                        user.id(),
                        user.account(),
                        user.channel(),
                        user.role(),
                        displayName,
                        user.passwordHash(),
                        user.passwordSalt(),
                        user.createdAt(),
                        user.lastLoginAt()));
            } else {
                users.add(user);
            }
        }

        data.setUsers(users);
        writeData(data);
    }

    private AuthStoreData readData() {
        try {
            ensureDirectory();
            if (!Files.exists(dataFilePath)) {
                return new AuthStoreData();
            }

            return objectMapper.readValue(dataFilePath.toFile(), AuthStoreData.class);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to read auth store", exception);
        }
    }

    private void writeData(AuthStoreData data) {
        try {
            ensureDirectory();
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(dataFilePath.toFile(), data);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to write auth store", exception);
        }
    }

    private void ensureDirectory() throws IOException {
        Path parent = dataFilePath.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }
    }
}