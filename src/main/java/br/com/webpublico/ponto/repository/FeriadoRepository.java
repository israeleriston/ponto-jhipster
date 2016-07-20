package br.com.webpublico.ponto.repository;

import br.com.webpublico.ponto.domain.Feriado;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Feriado entity.
 */
@SuppressWarnings("unused")
public interface FeriadoRepository extends JpaRepository<Feriado,Long> {

}
