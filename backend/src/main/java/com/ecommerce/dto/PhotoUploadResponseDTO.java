package com.ecommerce.dto;

public class PhotoUploadResponseDTO {
    private String message;
    private String profilePhoto;

    public PhotoUploadResponseDTO() {}

    public PhotoUploadResponseDTO(String message, String profilePhoto) {
        this.message = message;
        this.profilePhoto = profilePhoto;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
}
