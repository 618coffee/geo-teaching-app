package com.geoteaching.server.dto.response;

import java.util.List;

public record TeachingClassesResponse(
        List<String> classIds) {
}
