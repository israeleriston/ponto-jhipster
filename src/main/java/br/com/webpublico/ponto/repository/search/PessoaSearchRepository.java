package br.com.webpublico.ponto.repository.search;

import br.com.webpublico.ponto.domain.Pessoa;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Pessoa entity.
 */
public interface PessoaSearchRepository extends ElasticsearchRepository<Pessoa, Long> {
}
