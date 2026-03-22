package com.geoteaching.server.model;

import java.util.ArrayList;
import java.util.List;

public class AuthStoreData {

    private List<StoredUser> users = new ArrayList<>();

    public List<StoredUser> getUsers() {
        return users;
    }

    public void setUsers(List<StoredUser> users) {
        this.users = users;
    }
}