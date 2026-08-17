package br.com.matheus.manutencao.dto;

import br.com.matheus.manutencao.enums.TipoChamado;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChamadoRequestDTO {

    private TipoChamado tipo;
    private Long np;
    private String nome;
    private Long setorId;
    private Integer mecanicoMatricula;
    private String defeito;
    private String solucao;
    private LocalDate data;

}
