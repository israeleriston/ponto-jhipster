package br.com.webpublico.ponto.repository;

import br.com.webpublico.ponto.domain.Dia;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Dia entity.
 */
@SuppressWarnings("unused")
public interface DiaRepository extends JpaRepository<Dia,Long> {

}
