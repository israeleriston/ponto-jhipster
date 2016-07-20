package br.com.webpublico.ponto.repository.search;

import br.com.webpublico.ponto.domain.Telefone;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Telefone entity.
 */
public interface TelefoneSearchRepository extends ElasticsearchRepository<Telefone, Long> {
}
