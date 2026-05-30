package com.storybook.backend.service;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;


     @Value("${file.audio-max-size}")
    private long audioMaxSize;

    @Value("${file.image-max-size}")
    private long imageMaxSize;

    private static  final String[] ALLOWED_AUDIO_TYPES={
        "audio/mpeg", "audio/mp3", "audio/wav",
        "audio.ogg", "audio/m4a", "audio/x-m4a"
    };

    private static final  String[] ALLOWED_IMAGE_TYPES={
        "image/jpeg","image/png","image/gif","image/webp"
    };

    public String uploadAudio(MultipartFile file){
        validateFile(file, ALLOWED_AUDIO_TYPES,audioMaxSize,"Audio");

        try{

            Map<?,?> result=cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type","video",
                    "folder","stroybook/audio",
                    "use_filename",false,
                    "unique_filename",true
                )
            );

            String url=(String) result.get("secure_url");
            log.info("Audio uploaded to cloudinary:{}",url);

            return url;
        }catch(IOException e){
            throw new RuntimeException("Failed to upload audio"+ e.getMessage());
        }
    }

    public String uploadImage(MultipartFile file){
          validateFile(file, ALLOWED_IMAGE_TYPES, imageMaxSize, "Image");

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type", "image",
                    "folder", "storybook/images",
                    "use_filename", false,
                    "unique_filename", true
                )
            );

            String url = (String) result.get("secure_url");
            log.info("Image uploaded to Cloudinary: {}", url);
            return url;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file, String[] allowedTypes, long maxSize, String fileType){

        if(file.isEmpty()){
            throw new RuntimeException(fileType+ "File is empty");

        }

        if(file.getSize()>maxSize){
            long maxMB=maxSize/(1024*1024);
            throw new RuntimeException(fileType + "exceeds maximum size of"+maxMB +"MB");
        }

        String contentType=file.getContentType();
        boolean allowed=Arrays.asList(allowedTypes).contains(contentType);
        if(!allowed){
            throw new RuntimeException("Invalid " + fileType.toLowerCase() + " format. Allowed: "
                + String.join(", ", allowedTypes));
        }

    }
    
}
