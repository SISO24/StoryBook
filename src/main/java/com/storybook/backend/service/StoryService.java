package com.storybook.backend.service;
import com.storybook.backend.dto.*;
import com.storybook.backend.entity.*;
import com.storybook.backend.repo.UserRepo;
import com.storybook.backend.repo.StoryRepo;
import com.storybook.backend.repo.StoryBlockRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.List;


@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepo storyRepo;
    private final StoryBlockRepo storyBlockRepo;
    private final UserRepo userRepo;

    @Transactional
    public StoryResponse createStory(String email, CreateStoryRequest request){
        UserEntity user= userRepo.findByEmail(email)
        .orElseThrow(()->new RuntimeException("User not found"));
        
        StoryEntity story=StoryEntity.builder().title(request.title()).user(user).build();

        storyRepo.save(story);

        return StoryResponse.from(story);

    }

    public List<StorySummaryResponse>getMyStories(String email){
        UserEntity user= userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));

        return storyRepo.findByUserOrderByCreatedAtDesc(user)
        .stream().map(StorySummaryResponse::from)
        .toList();
    }

    public StoryResponse getStory(String email, UUID storyId){
              UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StoryEntity story = storyRepo.findByIdAndUser(storyId, user)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        return StoryResponse.from(story);
    }

        @Transactional
    public StoryResponse updateStoryTitle(String email, UUID storyId,
                                          CreateStoryRequest request) {
        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StoryEntity story = storyRepo.findByIdAndUser(storyId, user)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        story.setTitle(request.title());
        storyRepo.save(story);
        return StoryResponse.from(story);
    }

    @Transactional
    public void  deleteStory(String email, UUID storyId){
UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StoryEntity story = storyRepo.findByIdAndUser(storyId, user)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        storyRepo.delete(story);
    }

    @Transactional
    public StoryResponse addBlock(String email, UUID storyId, AddBlockRequest request){
        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StoryEntity story = storyRepo.findByIdAndUser(storyId, user)
                .orElseThrow(() -> new RuntimeException("Story not found"));

                int nextPosition = storyBlockRepo.countByStory(story)+1;

               
        StoryBlockEntity block = StoryBlockEntity.builder()
                .type(request.type())
                .content(request.content())
                .position(nextPosition)
                .story(story)
                .build();

storyBlockRepo.save(block);
story.getBlocks().add(block);
return StoryResponse.from(story);


    }

     @Transactional
    public StoryResponse updateBlock(String email, UUID storyId,
                                     UUID blockId, UpdateBlockRequest request) {
        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StoryEntity story = storyRepo.findByIdAndUser(storyId, user)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        StoryBlockEntity block = storyBlockRepo.findByIdAndStory(blockId, story)
                .orElseThrow(() -> new RuntimeException("Block not found"));

        block.setContent(request.content());
        storyBlockRepo.save(block);
        return StoryResponse.from(story);

    }

     @Transactional
    public StoryResponse deleteBlock(String email, UUID storyId, UUID blockId) {
        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StoryEntity story = storyRepo.findByIdAndUser(storyId, user)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        StoryBlockEntity block = storyBlockRepo.findByIdAndStory(blockId, story)
                .orElseThrow(() -> new RuntimeException("Block not found"));

        story.getBlocks().remove(block);
        storyBlockRepo.delete(block);
        return StoryResponse.from(story);
    }
    
}
