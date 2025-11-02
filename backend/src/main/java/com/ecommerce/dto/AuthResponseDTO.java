package com.ecommerce.dto;

public class AuthResponseDTO {
    private String token;
    private String name;
    private String surname;
    private String email;
    private String dni;
    private String profilePhoto;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, String name, String surname, String email, String dni, String profilePhoto) {
        this.token = token;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.dni = dni;
        this.profilePhoto = profilePhoto;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
}
