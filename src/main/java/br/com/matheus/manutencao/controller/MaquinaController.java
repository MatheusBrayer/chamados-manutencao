package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.entity.Maquina;
import br.com.matheus.manutencao.repository.MaquinaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/maquinas")
public class MaquinaController {

    private final MaquinaRepository maquinaRepository;

    public MaquinaController (MaquinaRepository maquinaRepository) {
        this.maquinaRepository = maquinaRepository;
    }

    @GetMapping
    public ResponseEntity<?> listarMaquinas () {
        try {
            List<Maquina> listaMaquinas = maquinaRepository.findAll();
            return ResponseEntity.ok(listaMaquinas);
        }catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao listar máquinas: " + error.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrarMaquina (@RequestBody Maquina novaMaquina) {
        try {
            Maquina maquinaSalva = maquinaRepository.save(novaMaquina);
            return ResponseEntity.status(201).body(maquinaSalva);
        }catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao cadastrar máquina: " + error.getMessage());
        }
    }

    @GetMapping("/{np}")
    public ResponseEntity<?> buscarPorNp (@PathVariable Long np) {
        try {
            Optional<Maquina> maquinaEncontrada = maquinaRepository.findByNp(np);

            if (maquinaEncontrada.isPresent()) {
                return ResponseEntity.ok(maquinaEncontrada.get());
            }

            return ResponseEntity.status(404).body("Máquina não cadastrada!");
        }catch (Exception error) {
            return ResponseEntity.status(500).body("Erro ao buscar máquina: " + error.getMessage());
        }
    }
}
