package br.com.matheus.manutencao.dto;

import br.com.matheus.manutencao.enums.TipoChamado;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChamadoResponseDTO {

    private Long id;
    private TipoChamado tipo;
    private Long np;
    private String maquina;
    private Long setorId;
    private String setor;
    private String mecanico;
    private String defeito;
    private String solucao;
    private LocalDate data;

}
