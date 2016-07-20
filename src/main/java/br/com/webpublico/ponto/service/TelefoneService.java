package br.com.webpublico.ponto.service;

import br.com.webpublico.ponto.domain.Telefone;
import br.com.webpublico.ponto.repository.TelefoneRepository;
import br.com.webpublico.ponto.repository.search.TelefoneSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Telefone.
 */
@Service
@Transactional
public class TelefoneService {

    private final Logger log = LoggerFactory.getLogger(TelefoneService.class);
    
    @Inject
    private TelefoneRepository telefoneRepository;
    
    @Inject
    private TelefoneSearchRepository telefoneSearchRepository;
    
    /**
     * Save a telefone.
     * 
     * @param telefone the entity to save
     * @return the persisted entity
     */
    public Telefone save(Telefone telefone) {
        log.debug("Request to save Telefone : {}", telefone);
        Telefone result = telefoneRepository.save(telefone);
        telefoneSearchRepository.save(result);
        return result;
    }

    /**
     *  Get all the telefones.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public Page<Telefone> findAll(Pageable pageable) {
        log.debug("Request to get all Telefones");
        Page<Telefone> result = telefoneRepository.findAll(pageable); 
        return result;
    }

    /**
     *  Get one telefone by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public Telefone findOne(Long id) {
        log.debug("Request to get Telefone : {}", id);
        Telefone telefone = telefoneRepository.findOne(id);
        return telefone;
    }

    /**
     *  Delete the  telefone by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Telefone : {}", id);
        telefoneRepository.delete(id);
        telefoneSearchRepository.delete(id);
    }

    /**
     * Search for the telefone corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Telefone> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Telefones for query {}", query);
        return telefoneSearchRepository.search(queryStringQuery(query), pageable);
    }
}
