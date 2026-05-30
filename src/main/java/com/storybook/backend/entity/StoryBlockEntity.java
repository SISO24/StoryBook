package com.storybook.backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="story_blocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class StoryBlockEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private BlockType type;

    @Column(nullable=false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
private Integer position;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name="story_id", nullable = false)
private StoryEntity story;

 @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum BlockType {
        TEXT,
        AUDIO,
        IMAGE
    }

}
