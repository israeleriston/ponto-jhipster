package br.com.webpublico.ponto.repository.search;

import br.com.webpublico.ponto.domain.Hora;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Hora entity.
 */
public interface HoraSearchRepository extends ElasticsearchRepository<Hora, Long> {
}
