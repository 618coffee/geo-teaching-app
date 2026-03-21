package com.geoteaching.server.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geoteaching.server.config.AuthProperties;
import com.geoteaching.server.domain.VerificationCodePurpose;
import com.geoteaching.server.model.AuthStoreData;
import com.geoteaching.server.model.StoredUser;
import com.geoteaching.server.model.VerificationCodeRecord;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JsonAuthStore {

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

    public synchronized void saveVerificationCode(VerificationCodeRecord record) {
        AuthStoreData data = readData();
        Instant now = Instant.now();

        List<VerificationCodeRecord> records = data.getVerificationCodes().stream()
                .filter(item -> item.expiresAt().isAfter(now))
                .filter(item -> !(item.account().equals(record.account()) && item.purpose() == record.purpose()))
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
        records.add(record);

        data.setVerificationCodes(records);
        writeData(data);
    }

    public synchronized Optional<VerificationCodeRecord> findActiveVerificationCode(String account, VerificationCodePurpose purpose) {
        AuthStoreData data = readData();
        Instant now = Instant.now();
        List<VerificationCodeRecord> nextRecords = data.getVerificationCodes().stream()
                .filter(record -> record.expiresAt().isAfter(now))
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));

        data.setVerificationCodes(nextRecords);
        writeData(data);

        return nextRecords.stream()
                .filter(record -> record.account().equals(account) && record.purpose() == purpose)
                .findFirst();
    }

    public synchronized VerificationCodeConsumeResult consumeVerificationCode(String account, VerificationCodePurpose purpose, String code) {
        AuthStoreData data = readData();
        Instant now = Instant.now();
        List<VerificationCodeRecord> nextRecords = new ArrayList<>();
        VerificationCodeRecord matchedRecord = null;

        for (VerificationCodeRecord record : data.getVerificationCodes()) {
            if (!record.expiresAt().isAfter(now)) {
                continue;
            }

            if (record.account().equals(account) && record.purpose() == purpose) {
                matchedRecord = record;
                if (record.code().equals(code)) {
                    continue;
                }
            }

            nextRecords.add(record);
        }

        data.setVerificationCodes(nextRecords);
        writeData(data);

        if (matchedRecord == null) {
            return new VerificationCodeConsumeResult(VerificationCodeStatus.MISSING, null);
        }

        if (!matchedRecord.code().equals(code)) {
            return new VerificationCodeConsumeResult(VerificationCodeStatus.INVALID, matchedRecord);
        }

        return new VerificationCodeConsumeResult(VerificationCodeStatus.SUCCESS, matchedRecord);
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

    public record VerificationCodeConsumeResult(VerificationCodeStatus status, VerificationCodeRecord record) {
    }

    public enum VerificationCodeStatus {
        SUCCESS,
        MISSING,
        INVALID
    }
}