package com.storybook.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import com.storybook.backend.entity.UserEntity;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name="refresh_token")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID id;

    @Column(nullable=false, unique=true)
    private String token;

    @ManyToOne (fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private UserEntity user;

    @Column (name="expires_at" ,nullable=false)
    private LocalDateTime expiresAt;

    @Column(nullable=false)
    @Builder.Default
    private boolean revoked=false;
    
    @Column(name="created_at",nullable=false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate(){
        this.createdAt=LocalDateTime.now();
    }

    public boolean isExpired(){
        return LocalDateTime.now().isAfter(this.expiresAt);

    }

    public boolean isValid(){
        return !revoked && !isExpired();
    }


}
