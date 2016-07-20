package br.com.webpublico.ponto.repository;

import br.com.webpublico.ponto.domain.Hora;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Hora entity.
 */
@SuppressWarnings("unused")
public interface HoraRepository extends JpaRepository<Hora,Long> {

}
