package com.storybook.backend.controller;
import com.storybook.backend.dto.UploadResponse;
import com.storybook.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor

public class UploadController {
    private final CloudinaryService cloudinaryService;

    @PostMapping("/audio")
     public ResponseEntity<UploadResponse> uploadAudio(
            @RequestParam("file") MultipartFile file) {
        String url = cloudinaryService.uploadAudio(file);
        return ResponseEntity.ok(new UploadResponse(
            url,
            file.getOriginalFilename(),
            file.getSize(),
            file.getContentType()
        ));
    }

    @PostMapping("/image")
    public ResponseEntity<UploadResponse> uploadImage(
        @RequestParam("file") MultipartFile file){
            String url=cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(new UploadResponse(
                url,
                file.getOriginalFilename(),
                file.getSize(),
                file.getContentType()
            ));
        }


}
