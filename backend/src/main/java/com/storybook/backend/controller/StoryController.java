package com.storybook.backend.controller;
import com.storybook.backend.dto.*;
import com.storybook.backend.service.StoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor

public class StoryController {

    private final StoryService storyService;

    @PostMapping
    public ResponseEntity<StoryResponse> createStory(
        @AuthenticationPrincipal UserDetails userDetails, 
        @Valid @RequestBody CreateStoryRequest request
    ){
        return ResponseEntity.status(HttpStatus.CREATED)
        .body(
            storyService
            .createStory(userDetails.getUsername(), request));

    }

    @GetMapping()
  public ResponseEntity<List<StorySummaryResponse>> getMyStories(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            storyService.getMyStories(userDetails.getUsername())
        );
    }
    
        @GetMapping("/{storyId}")
    public ResponseEntity<StoryResponse> getStory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID storyId) {
        return ResponseEntity.ok(
            storyService.getStory(userDetails.getUsername(), storyId)
        );
    }

     @PutMapping("/{storyId}")
    public ResponseEntity<StoryResponse> updateStoryTitle(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID storyId,
            @Valid @RequestBody CreateStoryRequest request) {
        return ResponseEntity.ok(
            storyService.updateStoryTitle(userDetails.getUsername(), storyId, request)
        );
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<Void> deleteStory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID storyId) {
        storyService.deleteStory(userDetails.getUsername(), storyId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{storyId}/blocks")
    public ResponseEntity<StoryResponse> addBlock(
        @AuthenticationPrincipal UserDetails userDetails, 
        @PathVariable  UUID storyId,  @Valid  @RequestBody AddBlockRequest request
    ){
        return ResponseEntity.status(HttpStatus.CREATED)
        .body(storyService
            .addBlock(userDetails.getUsername(),storyId,request));

    }

     @PutMapping("/{storyId}/blocks/{blockId}")
    public ResponseEntity<StoryResponse> updateBlock(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID storyId,
            @PathVariable UUID blockId,
            @Valid @RequestBody UpdateBlockRequest request) {
        return ResponseEntity.ok(
            storyService.updateBlock(
                userDetails.getUsername(), storyId, blockId, request));
    }

    @DeleteMapping("/{storyId}/blocks/{blockId}")
    public ResponseEntity<StoryResponse> deleteBlock(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID storyId,
            @PathVariable UUID blockId) {
        return ResponseEntity.ok(
            storyService.deleteBlock(
                userDetails.getUsername(), storyId, blockId));
    }

@PostMapping("/{storyId}/share")
public ResponseEntity<Map<String, String>> shareStory(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID storyId,
        @Valid @RequestBody ShareStoryRequest request) {
    storyService.shareStory(userDetails.getUsername(), storyId, request);
    return ResponseEntity.ok(Map.of("message", "Story shared successfully"));
}

@GetMapping("/shared-with-me")
public ResponseEntity<List<ShareStoryResponse>> getSharedWithMe(
        @AuthenticationPrincipal UserDetails userDetails) {
    return ResponseEntity.ok(
        storyService.getStoriesSharedWithMe(userDetails.getUsername())
    );
}

@GetMapping("/shared/{storyId}")
public ResponseEntity<StoryResponse> getSharedStory(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID storyId) {
    return ResponseEntity.ok(
        storyService.getSharedStory(userDetails.getUsername(), storyId)
    );
}

@DeleteMapping("/{storyId}/share/{shareId}")
public ResponseEntity<Map<String, String>> revokeShare(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID storyId,
        @PathVariable UUID shareId) {
    storyService.revokeShare(userDetails.getUsername(), storyId, shareId);
    return ResponseEntity.ok(Map.of("message", "Access revoked"));
}

}
