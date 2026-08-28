package br.com.matheus.manutencao.controller;

import br.com.matheus.manutencao.dto.ChamadoRequestDTO;
import br.com.matheus.manutencao.dto.ChamadoResponseDTO;
import br.com.matheus.manutencao.entity.Chamado;
import br.com.matheus.manutencao.enums.TipoChamado;
import br.com.matheus.manutencao.exception.AcessoNegadoException;
import br.com.matheus.manutencao.repository.ChamadoRepository;
import br.com.matheus.manutencao.service.ChamadoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chamados")
public class ChamadosController {

    private final ChamadoRepository chamadoRepository;
    private final ChamadoService chamadoService;

    public ChamadosController(ChamadoRepository chamadoRepository, ChamadoService chamadoService) {
        this.chamadoService = chamadoService;
        this.chamadoRepository = chamadoRepository;
    }

    @GetMapping
    public ResponseEntity<?> listarChamados(
            @RequestParam(required = false)
            TipoChamado tipo,

            @RequestParam(required = false)
            Long setorId,

            @RequestParam(required = false)
            Long np,

            @RequestParam(required = false)
            Integer mecanicoMatricula,

            @RequestParam(required = false)
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate dataInicio,

            @RequestParam(required = false)
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE
            )
            LocalDate dataFim,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {
        try {
            int paginaSegura = Math.max(page, 0);

            int tamanhoSeguro = Math.min(
                    Math.max(size, 1),
                    50
            );

            Pageable pageable = PageRequest.of(
                    paginaSegura,
                    tamanhoSeguro,
                    Sort.by(
                            Sort.Order.desc("data"),
                            Sort.Order.desc("id")
                    )
            );

            Page<ChamadoResponseDTO> chamados =
                    chamadoService.listarComFiltros(
                            tipo,
                            setorId,
                            np,
                            mecanicoMatricula,
                            dataInicio,
                            dataFim,
                            pageable
                    );

            return ResponseEntity.ok(chamados);

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body(
                            "Erro ao listar chamados: "
                                    + erro.getMessage()
                    );
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrarChamado (@RequestBody ChamadoRequestDTO dto) {
        try {
            Chamado chamadoSalvo = chamadoService.cadastrarChamado(dto);
            return ResponseEntity.ok(chamadoSalvo);
        }catch (Exception error) {
            return ResponseEntity.status(500).body(error.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarChamado(@PathVariable Long id) {
        try {
            ChamadoResponseDTO chamado = chamadoService.buscarChamadoPorId(id);
            return ResponseEntity.ok(chamado);

        } catch (RuntimeException error) {
            return ResponseEntity.status(404).body(error.getMessage());

        } catch (Exception error) {
            return ResponseEntity.status(500).body(error.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirChamado(
            @PathVariable Long id,
            @RequestHeader("X-Mecanico-Matricula")
            Integer matriculaUsuario
    ) {
        try {
            chamadoService.excluirChamado(
                    id,
                    matriculaUsuario
            );

            return ResponseEntity.ok(
                    "Chamado excluído com sucesso!"
            );

        } catch (RuntimeException erro) {
            String mensagem = erro.getMessage();

            if (
                    mensagem.equals(
                            "Chamado não encontrado."
                    )
            ) {
                return ResponseEntity
                        .status(404)
                        .body(mensagem);
            }

            if (
                    mensagem.equals(
                            "Somente administradores podem excluir chamados."
                    )
            ) {
                return ResponseEntity
                        .status(403)
                        .body(mensagem);
            }

            return ResponseEntity
                    .status(400)
                    .body(mensagem);

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body("Erro ao excluir chamado.");
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editarChamado(
            @PathVariable Long id,
            @RequestHeader("X-Mecanico-Matricula")
            Integer matriculaUsuario,
            @RequestBody ChamadoRequestDTO dto
    ) {
        try {
            ChamadoResponseDTO chamadoAtualizado =
                    chamadoService.editarChamado(
                            id,
                            matriculaUsuario,
                            dto
                    );

            return ResponseEntity.ok(
                    chamadoAtualizado
            );

        } catch (AcessoNegadoException erro) {
            return ResponseEntity
                    .status(403)
                    .body(erro.getMessage());

        } catch (RuntimeException erro) {
            if (
                    "Chamado não encontrado."
                            .equals(erro.getMessage())
            ) {
                return ResponseEntity
                        .status(404)
                        .body(erro.getMessage());
            }

            return ResponseEntity
                    .status(400)
                    .body(erro.getMessage());

        } catch (Exception erro) {
            return ResponseEntity
                    .status(500)
                    .body("Erro ao editar chamado.");
        }
    }
}
