package com.storybook.backend.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.storybook.backend.entity.UserEntity;
import com.storybook.backend.entity.RefreshTokenEntity;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefrreshTokenRepo extends JpaRepository<RefreshTokenEntity,UUID> {

    Optional<RefreshTokenEntity> findByToken(String token);
    
    @Modifying
    @Query("UPDATE RefreshTokenEntity r SET r.revoked=true  WHERE r.user=:user")
    void revokeAllByUser(UserEntity user);

    @Modifying
@Query("DELETE FROM RefreshTokenEntity r WHERE r.user = :user")
void deleteAllByUser(UserEntity user);
    
}
