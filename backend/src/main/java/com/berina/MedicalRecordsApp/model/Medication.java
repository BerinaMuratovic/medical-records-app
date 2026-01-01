package com.berina.MedicalRecordsApp.model;
import jakarta.persistence.*;

@Entity
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String manufacturer;
    private String form;

    public Medication() {}

    public Medication(String name, String manufacturer, String form) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.form = form;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getForm() { return form; }
    public void setForm(String form) { this.form = form; }
}

