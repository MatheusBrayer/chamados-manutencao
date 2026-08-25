package br.com.matheus.manutencao.service;

import br.com.matheus.manutencao.dto.MaquinaResponseDTO;
import br.com.matheus.manutencao.entity.Maquina;
import br.com.matheus.manutencao.repository.MaquinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaquinaService {

    private final MaquinaRepository maquinaRepository;

    public MaquinaService(
            MaquinaRepository maquinaRepository
    ) {
        this.maquinaRepository = maquinaRepository;
    }

    public List<MaquinaResponseDTO> listarMaquinas() {
        return maquinaRepository.findAll()
                .stream()
                .map(this::converterParaResponseDTO)
                .toList();
    }

    private MaquinaResponseDTO converterParaResponseDTO(
            Maquina maquina
    ) {
        MaquinaResponseDTO dto =
                new MaquinaResponseDTO();

        dto.setId(maquina.getId());
        dto.setNp(maquina.getNp());
        dto.setNome(maquina.getNome());

        if (maquina.getSetor() != null) {
            dto.setSetorId(
                    maquina.getSetor().getId()
            );

            dto.setSetor(
                    maquina.getSetor().getNome()
            );
        }

        return dto;
    }

    public MaquinaResponseDTO buscarMaquinaPorNp(Long np) {
        Maquina maquina = maquinaRepository.findByNp(np)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Máquina não encontrada."
                        )
                );

        return converterParaResponseDTO(maquina);
    }
}
