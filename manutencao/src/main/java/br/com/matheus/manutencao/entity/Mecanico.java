package br.com.matheus.manutencao.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "mecanicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mecanico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "matricula", nullable = false, unique = true)
    private Long matricula;

    @Column(name = "nome", nullable = false, length = 50)
    private String nome;
}
