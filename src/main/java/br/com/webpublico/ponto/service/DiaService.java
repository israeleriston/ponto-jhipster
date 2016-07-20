package br.com.webpublico.ponto.service;

import br.com.webpublico.ponto.domain.Dia;
import br.com.webpublico.ponto.repository.DiaRepository;
import br.com.webpublico.ponto.repository.search.DiaSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Dia.
 */
@Service
@Transactional
public class DiaService {

    private final Logger log = LoggerFactory.getLogger(DiaService.class);
    
    @Inject
    private DiaRepository diaRepository;
    
    @Inject
    private DiaSearchRepository diaSearchRepository;
    
    /**
     * Save a dia.
     * 
     * @param dia the entity to save
     * @return the persisted entity
     */
    public Dia save(Dia dia) {
        log.debug("Request to save Dia : {}", dia);
        Dia result = diaRepository.save(dia);
        diaSearchRepository.save(result);
        return result;
    }

    /**
     *  Get all the dias.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public Page<Dia> findAll(Pageable pageable) {
        log.debug("Request to get all Dias");
        Page<Dia> result = diaRepository.findAll(pageable); 
        return result;
    }

    /**
     *  Get one dia by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public Dia findOne(Long id) {
        log.debug("Request to get Dia : {}", id);
        Dia dia = diaRepository.findOne(id);
        return dia;
    }

    /**
     *  Delete the  dia by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Dia : {}", id);
        diaRepository.delete(id);
        diaSearchRepository.delete(id);
    }

    /**
     * Search for the dia corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Dia> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Dias for query {}", query);
        return diaSearchRepository.search(queryStringQuery(query), pageable);
    }
}
