package br.com.matheus.manutencao.dto;

import br.com.matheus.manutencao.enums.PerfilUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private Long id;

    private Integer matricula;

    private String nome;

    private PerfilUsuario perfil;

}
