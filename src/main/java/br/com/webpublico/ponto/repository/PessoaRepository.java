package br.com.webpublico.ponto.repository;

import br.com.webpublico.ponto.domain.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Pessoa entity.
 */
@SuppressWarnings("unused")
public interface PessoaRepository extends JpaRepository<Pessoa,Long> {

}
