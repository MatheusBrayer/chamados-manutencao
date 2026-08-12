package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.entity.Setor;
import br.com.matheus.manutencao.repository.SetorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/setores")
public class SetorController {

    private final SetorRepository setorRepository;

    public SetorController (SetorRepository setorRepository) {
        this.setorRepository = setorRepository;
    }

    @GetMapping
    public ResponseEntity<?> listarSetores () {
        try {
            List<Setor> setores = setorRepository.findAll();
            return ResponseEntity.ok(setores);
        }catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao listar setores: " + error.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrarSetor (@RequestBody Setor novoSetor) {
        try {
            Setor setorSalvo = setorRepository.save(novoSetor);
            return ResponseEntity.ok(setorSalvo);
        }catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao cadastrar novo setor: " + error.getMessage());
        }
    }
}
