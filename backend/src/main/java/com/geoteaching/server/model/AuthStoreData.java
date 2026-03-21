package com.geoteaching.server.model;

import java.util.ArrayList;
import java.util.List;

public class AuthStoreData {

    private List<StoredUser> users = new ArrayList<>();
    private List<VerificationCodeRecord> verificationCodes = new ArrayList<>();

    public List<StoredUser> getUsers() {
        return users;
    }

    public void setUsers(List<StoredUser> users) {
        this.users = users;
    }

    public List<VerificationCodeRecord> getVerificationCodes() {
        return verificationCodes;
    }

    public void setVerificationCodes(List<VerificationCodeRecord> verificationCodes) {
        this.verificationCodes = verificationCodes;
    }
}