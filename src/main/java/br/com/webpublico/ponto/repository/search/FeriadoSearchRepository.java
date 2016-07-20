package br.com.webpublico.ponto.repository.search;

import br.com.webpublico.ponto.domain.Feriado;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Feriado entity.
 */
public interface FeriadoSearchRepository extends ElasticsearchRepository<Feriado, Long> {
}
