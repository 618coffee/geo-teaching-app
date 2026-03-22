package com.geoteaching.server.dto.request;

import java.util.List;

public record UpdateTeachingClassesRequest(
        List<String> classIds) {
}
