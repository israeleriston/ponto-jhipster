package br.com.webpublico.ponto.repository.search;

import br.com.webpublico.ponto.domain.Dia;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Dia entity.
 */
public interface DiaSearchRepository extends ElasticsearchRepository<Dia, Long> {
}
