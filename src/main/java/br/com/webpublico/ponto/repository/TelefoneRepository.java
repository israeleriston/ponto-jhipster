package br.com.webpublico.ponto.repository;

import br.com.webpublico.ponto.domain.Telefone;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Telefone entity.
 */
@SuppressWarnings("unused")
public interface TelefoneRepository extends JpaRepository<Telefone,Long> {

}
