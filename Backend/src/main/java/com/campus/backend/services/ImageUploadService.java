package com.campus.backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageUploadService {

    private static final Logger logger = LoggerFactory.getLogger(ImageUploadService.class);

    @Value("${file.upload-dir}")
    private String uploadDir; // Base directory for uploads, e.g., "uploads" or "/path/to/uploads"

    /**
     * Uploads a multipart file to the configured directory.
     * Generates a unique file name to prevent collisions.
     *
     * @param file The MultipartFile to upload.
     * @return The URL path (e.g., "/uploads/unique-filename.jpg") for the uploaded file.
     * @throws IOException If an I/O error occurs during file operations.
     */
    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            logger.warn("Attempted to upload an empty file.");
            throw new IllegalArgumentException("Cannot upload empty file.");
        }

        Path uploadPath = Paths.get(uploadDir);

        // Ensure the upload directory exists
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            } catch (IOException e) {
                logger.error("Failed to create upload directory {}: {}", uploadPath.toAbsolutePath(), e.getMessage(), e);
                throw new IOException("Could not create upload directory: " + uploadPath.toAbsolutePath(), e);
            }
        }

        // Generate a unique file name
        // Get original file extension safely
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("Successfully uploaded file: {} as {}", originalFilename, uniqueFileName);
            return "/uploads/" + uniqueFileName; // Return a URL path
        } catch (IOException e) {
            logger.error("Failed to store file {}: {}", uniqueFileName, e.getMessage(), e);
            throw new IOException("Could not store file " + uniqueFileName + ". Please try again!", e);
        }
    }

    /**
     * Deletes a file from the upload directory based on its URL path.
     * The URL path is expected to be in the format "/uploads/unique_filename.jpg".
     *
     * @param fileUrl The URL path of the file to delete.
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            logger.warn("Attempted to delete file with null or empty URL path.");
            return;
        }

        // Extract the actual file name from the URL path
        String fileName;
        if (fileUrl.startsWith("/uploads/")) {
            fileName = fileUrl.substring("/uploads/".length());
        } else {
            logger.warn("File URL does not start with '/uploads/', cannot determine file name for deletion: {}", fileUrl);
            return;
        }

        Path fileToDeletePath = Paths.get(uploadDir).resolve(fileName);

        try {
            if (Files.exists(fileToDeletePath)) {
                Files.delete(fileToDeletePath);
                logger.info("Successfully deleted file: {}", fileToDeletePath.toAbsolutePath());
            } else {
                logger.warn("Attempted to delete non-existent file: {}", fileToDeletePath.toAbsolutePath());
            }
        } catch (IOException e) {
            logger.error("Could not delete file {}: {}", fileToDeletePath.toAbsolutePath(), e.getMessage(), e);
        }
    }

    /**
     * Retrieves the Path object for a given filename within the upload directory.
     * This method assumes 'filename' is just the unique generated name, not the full URL.
     *
     * @param filename The unique name of the file (e.g., "unique-filename.jpg").
     * @return The Path to the file.
     */
    public Path getFile(String filename) {
        if (filename == null || filename.isEmpty()) {
            logger.warn("Attempted to get file with null or empty filename.");
            return null; // Or throw an IllegalArgumentException
        }
        return Paths.get(uploadDir).resolve(filename);
    }
}