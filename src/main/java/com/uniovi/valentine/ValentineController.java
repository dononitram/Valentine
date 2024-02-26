package com.uniovi.valentine;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Controller
public class ValentineController {

    private final ResourceLoader resourceLoader;

    public ValentineController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @RequestMapping("/")
    public String getIndex() {
        return "redirect:/home";
    }

    @RequestMapping("/about")
    public String getAbout() {
        return "about";
    }

    @RequestMapping("/home")
    public String getHome() {
        return "index";
    }

    @RequestMapping(value = "/home/riddle")
    public String getRiddle(Model model, @RequestParam String riddleAnswer) {
        model.addAttribute("riddleAnswer", riddleAnswer);
        return "home/riddle";
    }

    @RequestMapping("/home/quest")
    public String getQuest() {
        return "home/quest";
    }

    @RequestMapping("/home/games")
    public String getGames() {
        return "home/games";
    }

    @RequestMapping("/home/games/memory")
    public String getMemory() {
        return "home/games/memory";
    }

    @RequestMapping("/home/games/crossword")
    public String getCrossword() {
        return "home/games/crossword";
    }

    // Post request for crossword with several parameters
    @RequestMapping(value = "/home/games/crossword", method = RequestMethod.POST)
    public String postCrossword(
            @RequestParam String color,
            @RequestParam String food,
            @RequestParam int rating,
            @RequestParam String nextYear) {

        // Get the current date and time for creating a unique filename
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmmss");
        String fileName = "crossword_" + dateFormat.format(new Date()) + ".txt";
        fileName = "src/main/resources/static/files/data/" + fileName;

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
            // Write the parameters to the file
            writer.write("Color: " + color);
            writer.newLine();
            writer.write("Food: " + food);
            writer.newLine();
            writer.write("Rating: " + rating);
            writer.newLine();
            writer.write("Next Year: " + nextYear);
        } catch (IOException e) {
            // log the error
            System.out.println("Error writing to file: " + e.getMessage());
        }

        // Return the view name or redirect to another page as needed
        return "home/games/crossword";
    }

    // Error writing to file: class path resource [static/files/crossword_20240212_182313.txt] cannot be resolved to URL because it does not exist

    @RequestMapping("/home/games/finale")
    public String getFinale() {
        return "home/games/finale";
    }

    // Post request for finale if date parameter is correct redirect to /download
    @RequestMapping(value = "/home/games/finale", method = RequestMethod.POST)
    public String postFinale(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {

        LocalDate targetDate = LocalDate.of(2024, 1, 6);

        if(date != null && date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().equals(targetDate)) {
            return "redirect:/download";
        }

        return "home/games/finale";
    }

}